from django.urls import path
from .views import GetCoursesView, EnrollUserView,GetUserByUsernameView

urlpatterns = [
    path('courses/', GetCoursesView.as_view(), name='get_courses'),
    path('enroll/', EnrollUserView.as_view(), name='enroll_user'),
    path('user/', GetUserByUsernameView.as_view(), name='get_user_by_username'),
]