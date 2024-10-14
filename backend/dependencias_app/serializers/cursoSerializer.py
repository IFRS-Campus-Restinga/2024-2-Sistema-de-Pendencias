from rest_framework import serializers
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma

class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'

# def create(self, validated_data):
#         turmas_data = validated_data.pop('turmas')
#         curso = Curso.objects.create(**validated_data)
        
#         for turma_data in turmas_data:
#             Turma.objects.create(curso=curso, **turma_data)
        
#         return curso        

      

