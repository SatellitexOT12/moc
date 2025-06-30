from django.db import models
from users.models import CustomUser

class Course(models.Model):
    moodle_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    category = models.IntegerField(null=True, blank=True)
    startdate = models.BigIntegerField(null=True, blank=True)
    enddate = models.BigIntegerField(null=True, blank=True)
    summary = models.TextField()
    image_url = models.URLField(null=True, blank=True)

class Enrollment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course')