from rest_framework import serializers
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma

class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'
     

      

