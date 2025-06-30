# users/views.py
from django.contrib.auth import authenticate,logout
from django.contrib.auth import login as django_login
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import UserProfile
import json

User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(View):
    def post(self, request):
        data = json.loads(request.body)
        name = data.get('name', '')
        
        if User.objects.filter(email=data['email']).exists():
            return JsonResponse({'error': 'Email ya registrado'}, status=400)
        
        names = name.split(" ", 1)
        first_name = names[0]
        last_name = names[1] if len(names) > 1 else ''

        user = User.objects.create_user(
            email=data['email'],
            password=data['password'],
            username=data.get('username') or data['email'].split('@')[0],
            first_name=first_name,
            last_name=last_name
        )

        UserProfile.objects.create(
            user=user,
            age=data.get('age'),
            country=data.get('country'),
            purpose=data.get('purpose')
        )

        return JsonResponse({'message': 'Usuario creado exitosamente'})
    

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'error': 'Faltan credenciales'}, status=400)

            user = authenticate(username=email, password=password)

            if user is None:
                return JsonResponse({'error': 'Credenciales inválidas'}, status=400)

            django_login(request, user)

            return JsonResponse({
                'message': 'Login exitoso',
                'user': {
                    'id': user.id,
                    'name': user.get_full_name(),
                    'email': user.email,
                    'is_superuser': user.is_superuser
                }
            }, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(View):
    def post(self, request):
        logout(request)
        return JsonResponse({'message': 'Sesión cerrada correctamente'}, status=200)