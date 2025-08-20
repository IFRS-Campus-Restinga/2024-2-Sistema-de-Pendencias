from rest_framework import serializers
from dependencias_app.models.professor_progressao import ProfessorProgressaoIntegrado, ProfessorProgressaoProEJA

class ProfessorPEDIntegradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessorProgressaoIntegrado
        fields = '__all__'

class ProfessorPEDProEJASerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessorProgressaoProEJA
        fields = '__all__'