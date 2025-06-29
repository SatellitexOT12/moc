# moodle_api/views.py
import os
import requests
from dotenv import load_dotenv
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json

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
        

def get_user_by_email(email):
    params = {
        'wstoken': MOODLE_TOKEN,
        'wsfunction': 'core_user_get_users',
        'moodlewsrestformat': 'json',
        'criteria[0][key]': 'email',
        'criteria[0][value]': email
    }
    response = requests.get(MOODLE_URL, params=params)
    data = response.json()
    if isinstance(data, list) and len(data) > 0:
        return data[0]
    return None

def create_user(name, email, city, country, age=None, password=None):
    names = name.split(' ', 1)
    first_name = names[0]
    last_name = names[1] if len(names) > 1 else ''

    # Generar una contraseña segura si no se proporciona
    user_password = password if password else generate_secure_password()

    params = {
        'wstoken': MOODLE_TOKEN,
        'wsfunction': 'core_user_create_users',
        'moodlewsrestformat': 'json',
        'users[0][username]': email.split('@')[0],
        'users[0][password]': user_password,
        'users[0][firstname]': first_name,
        'users[0][lastname]': last_name,
        'users[0][email]': email,
        'users[0][city]': city,
        'users[0][country]': country,
        'users[0][customfields][0][type]': 'age',
        'users[0][customfields][0][value]': age or '',
        'users[0][customfields][1][type]': 'purpose',
        'users[0][customfields][1][value]': 'pendiente',
    }

    response = requests.post(MOODLE_URL, data=params)
    return response.json()[0] if isinstance(response.json(), list) else None

def enroll_user_in_course(user_id, course_id):
    params = {
        'wstoken': MOODLE_TOKEN,
        'wsfunction': 'enrol_manual_enrol_users',
        'moodlewsrestformat': 'json',
        'enrolments[0][roleid]': 5,
        'enrolments[0][userid]': user_id,
        'enrolments[0][courseid]': course_id
    }

    response = requests.post(MOODLE_URL, data=params)
    return response.json()

def generate_secure_password(length=12):
    """Genera una contraseña aleatoria segura"""
    import secrets
    import string
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(characters) for _ in range(length))

@method_decorator(csrf_exempt, name='dispatch')
class EnrollCourseView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            course_id = data.get('courseid')
            name = data.get('name')
            email = data.get('email')
            age = data.get('age')
            city = data.get('city')
            country = data.get('country')
            purpose = data.get('purpose')
            password = data.get('password')  # Nueva propiedad

            if not all([course_id, name, email, city, country, password]):
                return JsonResponse({'error': 'Campos requeridos incompletos'}, status=400)

            # 1. Buscar si el usuario ya existe
            user = get_user_by_email(email)

            if not user:
                # 2. Crear nuevo usuario
                user = create_user(name, email, city, country, age, password)
                if not user or 'id' not in user:
                    return JsonResponse({'error': 'Error al crear el usuario en Moodle'}, status=500)

            # 3. Inscribir en el curso
            result = enroll_user_in_course(user['id'], course_id)
            return JsonResponse({
                'message': '¡Matrícula exitosa!',
                'user_id': user['id']
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)