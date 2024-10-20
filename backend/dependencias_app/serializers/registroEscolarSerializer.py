# alunoSerializer.py
from rest_framework import serializers
from dependencias_app.models.registroEscolar import RegistroEscolar

class RegistroEscolarSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroEscolar
        fields = '__all__'
