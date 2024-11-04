from rest_framework import serializers
from dependencias_app.models.disciplina import Disciplina


class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = '__all__'