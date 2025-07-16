from rest_framework import serializers
from django.utils import timezone
from dependencias_app.models.ppt import PPT
from dependencias_app.models.notificacao import Notificacao

class PPT_Serializer(serializers.ModelSerializer):
    aluno = serializers.UUIDField()
    professor_ppt = serializers.UUIDField()
    professor_disciplina = serializers.UUIDField()
    curso = serializers.UUIDField()
    disciplina = serializers.UUIDField()
    turma_atual = serializers.UUIDField()
    turma_progressao = serializers.UUIDField()

    class Meta:
        model = PPT
        fields = '__all__'
