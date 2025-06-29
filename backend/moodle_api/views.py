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