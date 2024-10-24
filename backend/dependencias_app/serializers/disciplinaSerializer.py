from rest_framework import serializers
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.curso import Curso

class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = '__all__'