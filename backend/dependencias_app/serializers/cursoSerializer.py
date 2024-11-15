from rest_framework import serializers
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.turma import Turma
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer

class CursoSerializer(serializers.ModelSerializer):
    turmas = serializers.SerializerMethodField()
    disciplinas = serializers.SerializerMethodField()

    class Meta:
        model = Curso
        fields = '__all__'
    
    def get_turmas(self, obj):
        if obj.turmas and hasattr(obj, 'turmas'):
            return obj.turmas
        return None

    def get_disciplinas(self, obj):
        if obj.disciplinas and hasattr(obj, 'disciplinas'):
            return obj.disciplinas
        return None

    
    def save(self, **kwargs):
        formCurso = super().save(**kwargs)
        formCurso.full_clean()
        formCurso.save()
        return formCurso