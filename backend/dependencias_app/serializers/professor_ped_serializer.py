from rest_framework import serializers
from dependencias_app.models.professor_progressao import ProfessorProgressaoIntegrado, ProfessorProgressaoProeja

class ProfessorPEDIntegradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessorProgressaoIntegrado
        fields = '__all__'

class ProfessorPEDProejaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessorProgressaoProeja
        fields = '__all__'