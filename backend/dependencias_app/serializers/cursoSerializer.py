from rest_framework import serializers
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.turma import Turma
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer

class CursoSerializer(serializers.ModelSerializer):
    turmas = TurmaSerializer(many=True)  # Removido read_only=True
    disciplinas = DisciplinaSerializer(many=True)  # Removido read_only=True
    coordenador = UsuarioBaseSerializer()  # Representação completa do coordenador

    class Meta:
        model = Curso
        fields = '__all__'

    def save(self, **kwargs):
        formCurso = super().save(**kwargs)
        formCurso.full_clean()
        formCurso.save()
        return formCurso

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Representação completa do coordenador
        if hasattr(instance, 'coordenador'):
            representation['coordenador'] = UsuarioBaseSerializer(instance.coordenador).data

        # Representação completa das turmas
        if hasattr(instance, 'turmas'):
            representation['turmas'] = TurmaSerializer(instance.turmas.all(), many=True).data

        # Representação completa das disciplinas
        if hasattr(instance, 'disciplinas'):
            representation['disciplinas'] = DisciplinaSerializer(instance.disciplinas.all(), many=True).data

        return representation
