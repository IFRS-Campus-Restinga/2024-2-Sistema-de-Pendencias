# alunoSerializer.py
from rest_framework import serializers
from dependencias_app.models.aluno import Aluno

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = '__all__'

    def save(self, **kwargs):
        formAluno = super().save(**kwargs)

        formAluno.full_clean()
        formAluno.save()
        return formAluno
