from rest_framework import serializers
from dependencias_app.models.ped_EMI import PED_EMI
from dependencias_app.models.notificacao import Notificacao
from django.conf import settings


class PED_EMI_Serializer(serializers.ModelSerializer):
    aluno = serializers.UUIDField()
    professor_disciplina = serializers.UUIDField()
    curso = serializers.UUIDField()
    disciplina = serializers.UUIDField()
    periodo_letivo = serializers.UUIDField()
    turma_atual = serializers.UUIDField()

    class Meta:
        model = PED_EMI
        fields = '__all__'
    
    