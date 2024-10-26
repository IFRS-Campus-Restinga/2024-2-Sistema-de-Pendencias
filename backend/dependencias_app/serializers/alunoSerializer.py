from rest_framework import serializers
from dependencias_app.models.aluno import Aluno

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = ['id', 'nome_completo', 'cpf', 'data_nascimento', 'matricula', 'telefone', 'usuario']
