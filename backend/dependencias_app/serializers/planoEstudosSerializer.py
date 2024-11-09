from rest_framework import serializers
from dependencias_app.models.planoEstudos import PlanoEstudos
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer

class PlanoEstudosSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoEstudos
        fields = '__all__'

    def save(self, **kwargs):
        formPlanoEstudo = super().save(**kwargs)
        formPlanoEstudo.full_clean()
        formPlanoEstudo.save()
        return formPlanoEstudo

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Consultar dados do aluno
        if hasattr(instance, 'aluno'):
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data

        # Consultar dados do curso
        if hasattr(instance, 'curso'):
            representation['curso'] = CursoSerializer(instance.curso).data

        # Consultar dados da disciplina
        if hasattr(instance, 'disciplina'):
            representation['disciplina'] = DisciplinaSerializer(instance.disciplina).data

        return representation
