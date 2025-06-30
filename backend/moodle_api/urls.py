from django.urls import path
from .views import GetEnrolledCourses, GetUserSiteInfo,EnrollUserView,ExportCourseUsersView

urlpatterns = [
    path('site-info/', GetUserSiteInfo.as_view(), name='get_site_info'),
    path('enrolled-courses/', GetEnrolledCourses.as_view(), name='get_enrolled_courses'),
    path('enroll/', EnrollUserView.as_view(), name='enroll'),
    path('export/<int:course_id>/', ExportCourseUsersView.as_view(), name='export_enrollments'),
]