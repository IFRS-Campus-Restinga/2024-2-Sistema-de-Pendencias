from rest_framework import serializers
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from dependencias_app.serializers.turmaSerializer import TurmaSerializer

class CursoSerializer(serializers.ModelSerializer):
    turmas = TurmaSerializer(many=True, read_only=True) 

    class Meta:
        model = Curso
        fields = '__all__'


      

