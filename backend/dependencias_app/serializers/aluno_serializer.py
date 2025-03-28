from rest_framework import serializers
from dependencias_app.models.aluno import Aluno

class Aluno_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = ['id', 'cpf', 'data_nascimento', 'matricula', 'telefone', 'usuario']

    def save(self, **kwargs):
        formAluno = super().save(**kwargs)

        formAluno.full_clean()
        formAluno.save()
        return formAluno
