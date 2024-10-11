from dependencias_app.models.curso import Curso
from rest_framework import serializers

class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fiels: '__all__'
