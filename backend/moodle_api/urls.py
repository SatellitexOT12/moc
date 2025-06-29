from django.urls import path
from .views import GetEnrolledCourses, GetUserSiteInfo

urlpatterns = [
    path('site-info/', GetUserSiteInfo.as_view(), name='get_site_info'),
    path('enrolled-courses/', GetEnrolledCourses.as_view(), name='get_enrolled_courses'),
]