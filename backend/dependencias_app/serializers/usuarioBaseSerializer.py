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
