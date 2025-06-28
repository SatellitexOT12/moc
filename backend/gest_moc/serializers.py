# gest_moc/serializers.py
from rest_framework import serializers
from .models import Moc

class MocSerializer(serializers.ModelSerializer):
    class Meta:
        model = Moc
        fields = '__all__'