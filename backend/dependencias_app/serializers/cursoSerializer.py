from rest_framework import serializers
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.turma import Turma
from google_auth.models import UsuarioBase
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer

class CursoSerializer(serializers.ModelSerializer):
    turmas = TurmaSerializer(many=True, read_only=True)
    disciplinas = DisciplinaSerializer(many=True, read_only=True)
    coordenador = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Coordenador'))

    class Meta:
        model = Curso
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.coordenador:
            representation['coordenador'] = UsuarioBaseSerializer(instance.coordenador).data

        return representation

    
    def save(self, **kwargs):
        formCurso = super().save(**kwargs)
        formCurso.full_clean()
        formCurso.save()
        return formCurso