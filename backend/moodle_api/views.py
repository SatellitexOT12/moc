# moodle_api/views.py
import os
import requests
import csv
import json
from dotenv import load_dotenv
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from users.models import UserProfile
from .models import Course, Enrollment
from django.http import HttpResponse


load_dotenv()

MOODLE_URL = os.getenv("MOODLE_URL")
MOODLE_TOKEN = os.getenv("MOODLE_TOKEN")

class GetUserSiteInfo(View):
    def get(self, request):
        params = {
            'wstoken': MOODLE_TOKEN,
            'wsfunction': 'core_webservice_get_site_info',
            'moodlewsrestformat': 'json'
        }
        try:
            response = requests.get(MOODLE_URL, params=params)
            return JsonResponse(response.json())
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

class GetEnrolledCourses(View):
    def get(self, request):
        # Paso 1: Obtener el userid del usuario asociado al token
        site_info_url = f"{MOODLE_URL}?wstoken={MOODLE_TOKEN}&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json"
        site_info_response = requests.get(site_info_url)
        site_info = site_info_response.json()

        if 'userid' not in site_info:
            return JsonResponse({'error': 'No se pudo obtener el userid del usuario'}, status=400)

        user_id = site_info['userid']

        # Paso 2: Obtener los cursos inscritos
        params = {
            'wstoken': MOODLE_TOKEN,
            'wsfunction': 'core_enrol_get_users_courses',
            'moodlewsrestformat': 'json',
            'userid': user_id,
            
        }

        try:
            response = requests.get(MOODLE_URL, params=params)
            return JsonResponse(response.json(), safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        

@method_decorator(csrf_exempt, name='dispatch')
class EnrollUserView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            course_id = data.get('courseid')

            if not course_id:
                return JsonResponse({'error': 'Falta el ID del curso'}, status=400)

            # 1. Verificar si el usuario está autenticado
            if not request.user.is_authenticated:
                return JsonResponse({'error': 'Debes iniciar sesión'}, status=401)

            # 2. Buscar o crear curso localmente
            course, created = Course.objects.get_or_create(
                moodle_id=course_id,
                defaults={
                    'name': f'Curso {course_id}',
                    'summary': '',
                    'category': 3  # Por defecto categoría MOOC
                }
            )

            # 3. Si se creó, sincronizar con Moodle para obtener datos reales
            if created:
                params = {
                    'wstoken': MOODLE_TOKEN,
                    'wsfunction': 'core_course_get_courses',
                    'moodlewsrestformat': 'json',
                    'courseids[0]': course_id
                }

                response = requests.get(MOODLE_URL, params=params)
                if response.status_code == 200:
                    course_data = response.json()[0]
                    course.name = course_data['fullname']
                    course.summary = course_data.get('summary', '')
                    course.category = course_data.get('categoryid', 3)
                    course.save()

            # 4. Crear la matrícula local
            user = request.user
            enrollment, created = Enrollment.objects.get_or_create(user=user, course=course)

            if not created:
                return JsonResponse({'message': 'Ya estás matriculado en este curso'})

            return JsonResponse({
                'message': '¡Matrícula exitosa!',
                'course_name': course.name
            })

        except Exception as e:
            print("Error al matricular:", str(e))
            return HttpResponse(f"Ocurrió un error en el servidor: {str(e)}")

def get_course_from_moodle(course_id):
    """Obtiene los datos del curso desde Moodle"""
    params = {
        'wstoken': os.getenv('MOODLE_TOKEN'),
        'wsfunction': 'core_course_get_courses',
        'moodlewsrestformat': 'json',
        'courseids[0]': course_id
    }
    response = requests.get(os.getenv('MOODLE_URL'), params=params)
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list) and len(data) > 0:
            return data[0]
    return None

class ExportCourseUsersView(View):
    def get(self, request, course_id):
        try:
            # 1. Busca el curso local o lo crea si no existe
            course, created = Course.objects.get_or_create(
                moodle_id=course_id,
                defaults={'name': f'Curso {course_id} (sin sincronizar)'}
            )

            if created:
                # Si acabamos de crearlo, obtenemos su nombre real desde Moodle
                moodle_data = get_course_from_moodle(course_id)
                if moodle_data:
                    course.name = moodle_data['fullname']
                    course.summary = moodle_data.get('summary', '')
                    course.startdate = moodle_data.get('startdate')
                    course.enddate = moodle_data.get('enddate')
                    course.save()

            # 2. Obtiene las matrículas locales
            enrollments = Enrollment.objects.filter(course=course)

            # 3. Prepara respuesta CSV
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="usuarios_curso_{course.name}.csv"'

            writer = csv.writer(response)
            writer.writerow([
                'Nombre Completo',
                'Correo Electrónico',
                'Edad',
                'País',
                'Propósito',
                'Fecha de Matrícula'
            ])

            for enrollment in enrollments:
                user = enrollment.user
                profile, created = UserProfile.objects.get_or_create(user=user)# Asegúrate de tener el related_name='profile' en UserProfile
                writer.writerow([
                    f"{user.first_name} {user.last_name}".strip(),
                    user.email,
                    profile.age or 'No disponible',
                    profile.country or 'No disponible',
                    profile.purpose or 'No disponible',
                    enrollment.enrolled_at.strftime("%d/%m/%Y %H:%M")
                ])

            return response

        except Exception as e:
            return HttpResponse(f"Error al exportar usuarios: {str(e)}")