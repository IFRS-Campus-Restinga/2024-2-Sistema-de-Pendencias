from rest_framework import serializers
from dependencias_app.models.curso import Curso

class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = ['nome', 'carga_horaria', 'modalidade', 'turmas']

