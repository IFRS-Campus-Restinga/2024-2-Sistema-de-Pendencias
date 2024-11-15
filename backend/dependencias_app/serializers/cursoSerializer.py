from rest_framework import serializers
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.turma import Turma
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer

class CursoSerializer(serializers.ModelSerializer):
    turmas = TurmaSerializer(many=True)
    disciplinas = DisciplinaSerializer(many=True)

    class Meta:
        model = Curso
        fields = '__all__'
    
    def save(self, **kwargs):
        formCurso = super().save(**kwargs)
        formCurso.full_clean()
        formCurso.save()
        return formCurso