from rest_framework import serializers
from dependencias_app.models.curso import Curso
from dependencias_app.serializers.turmaSerializer import TurmaSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer

class CursoSerializer(serializers.ModelSerializer):
    turmas = TurmaSerializer(many=True, read_only=True) 
    disciplinas = DisciplinaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Curso
        fields = '__all__'
    
    def save(self, **kwargs):
        formCurso = super().save(**kwargs)

        formCurso.full_clean()
        formCurso.save()
        return formCurso


      

