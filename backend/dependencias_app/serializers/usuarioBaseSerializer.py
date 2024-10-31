from rest_framework import serializers
from google_auth.models import UsuarioBase
from django.contrib.auth.models import Group
from dependencias_app.serializers.alunoSerializer import AlunoSerializer 
from dependencias_app.serializers.professorSerializer import ProfessorSerializer

class UsuarioBaseSerializer(serializers.ModelSerializer):
    perfil = serializers.CharField(source='grupo.name', read_only=True)
    grupo = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), write_only=True)  # Incluir o campo de grupo
    infos_professor = ProfessorSerializer(read_only=True)
    infos_aluno = AlunoSerializer(read_only=True)

    class Meta:
        model = UsuarioBase
        fields = ['id', 'nome', 'email', 'data_ingresso', 'primeiro_login', 'grupo', 'perfil', 'infos_professor', 'infos_aluno']

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

        return representation