from rest_framework import serializers
from dependencias_app.models.disciplina import Disciplina
from .cursoSerializer import CursoSerializer

class DisciplinaSerializer(serializers.ModelSerializer):
    curso = CursoSerializer(read_only=True)
    class Meta:
        model = Disciplina
        fields = '__all__'