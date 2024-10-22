from rest_framework import serializers
from dependencias_app.models.aluno import Aluno

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = '__all__'
