from rest_framework import serializers
from dependencias_app.models.professor import Professor

class ProfessorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Professor
        fields = ['id', 'cpf', 'matricula', 'usuario']
