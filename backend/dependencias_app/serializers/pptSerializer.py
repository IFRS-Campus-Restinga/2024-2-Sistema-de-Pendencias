from rest_framework import serializers
from dependencias_app.models.ppt import PPT
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer

class PPTSerializer(serializers.ModelSerializer):
    aluno = UsuarioBaseSerializer(read_only=True)
    professor = UsuarioBaseSerializer(read_only=True)
    curso = CursoSerializer(read_only=True)
    disciplina = DisciplinaSerializer(read_only=True)
    turmaOrigem = TurmaSerializer(read_only=True)
    turmaProgressao = TurmaSerializer(read_only=True)

    class Meta:
        model = PPT
        fields = '__all__'