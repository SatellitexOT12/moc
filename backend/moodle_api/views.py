# moodle_api/views.py
import os
import requests
from dotenv import load_dotenv
from django.http import JsonResponse
from django.views import View
from django.middleware.csrf import get_token

load_dotenv()

MOODLE_URL = os.getenv("MOODLE_URL")
MOODLE_TOKEN = os.getenv("MOODLE_TOKEN")

class GetCoursesView(View):
    def get(self, request):
        params = {
            'wstoken': MOODLE_TOKEN,
            'wsfunction': 'core_course_get_courses',
            'moodlewsrestformat': 'json'
        }
        try:
            response = requests.get(MOODLE_URL, params=params)
            return JsonResponse(response.json(), safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

class EnrollUserView(View):
    def post(self, request):
        course_id = request.POST.get('courseid')
        user_id = request.POST.get('userid')
        
        if not course_id or not user_id:
            return JsonResponse({'error': 'Faltan parámetros'}, status=400)

        params = {
            'wstoken': MOODLE_TOKEN,
            'wsfunction': 'enrol_manual_enrol_users',
            'moodlewsrestformat': 'json',
            'enrolments[0][roleid]': 5,  # ID de rol "estudiante"
            'enrolments[0][userid]': user_id,
            'enrolments[0][courseid]': course_id
        }
        
        try:
            response = requests.post(MOODLE_URL, data=params)
            return JsonResponse(response.json())
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

class GetUserByUsernameView(View):
    def get(self, request):
        username = request.GET.get('username')
        if not username:
            return JsonResponse({'error': 'Falta el nombre de usuario'}, status=400)

        params = {
            'wstoken': MOODLE_TOKEN,
            'wsfunction': 'core_user_get_users',
            'moodlewsrestformat': 'json',
            'criteria[0][key]': 'username',
            'criteria[0][value]': username
        }

        try:
            response = requests.get(MOODLE_URL, params=params)
            users = response.json()
            if isinstance(users, list) and len(users) > 0:
                return JsonResponse(users[0])  # Devuelve el primer resultado
            else:
                return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)