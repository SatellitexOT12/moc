# Moc/views.py
from rest_framework import viewsets
from .models import Moc
from .serializers import MocSerializer

class MocViewSet(viewsets.ModelViewSet):
    queryset = Moc.objects.all().order_by('-created_at')
    serializer_class = MocSerializer