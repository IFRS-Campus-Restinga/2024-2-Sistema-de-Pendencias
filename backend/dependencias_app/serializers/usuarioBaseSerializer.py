from rest_framework import serializers
from google_auth.models import UsuarioBase

class UsuarioBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioBase
        fields = '__all__'