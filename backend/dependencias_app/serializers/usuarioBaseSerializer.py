from rest_framework import serializers
from google_auth.models import UsuarioBase
from django.contrib.auth.models import Group
from dependencias_app.serializers.alunoSerializer import AlunoSerializer 
from dependencias_app.serializers.professorSerializer import ProfessorSerializer

class UsuarioBaseSerializer(serializers.ModelSerializer):
    grupo = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())
    infos_professor = ProfessorSerializer(read_only=True)
    infos_aluno = AlunoSerializer(read_only=True)

    class Meta:
        model = UsuarioBase
        fields = ['id', 'nome', 'email', 'data_ingresso', 'primeiro_login', 'grupo', 'is_active', 'infos_professor', 'infos_aluno']

    def save(self, **kwargs):
        formUsuarioBase = super().save(**kwargs)

        formUsuarioBase.full_clean()
        formUsuarioBase.save()
        return formUsuarioBase

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.grupo:
            if instance.grupo.name == 'Professor':
                if hasattr(instance, 'professor'):
                    representation['infos_professor'] = ProfessorSerializer(instance.professor).data
                else:
                    representation['infos_professor'] = {}

            elif instance.grupo.name == 'Aluno':
                if hasattr(instance, 'aluno'):
                    representation['infos_aluno'] = AlunoSerializer(instance.aluno).data
                else:
                    representation['infos_aluno'] = {}
            
            representation['grupo'] = instance.grupo.name

        return representation