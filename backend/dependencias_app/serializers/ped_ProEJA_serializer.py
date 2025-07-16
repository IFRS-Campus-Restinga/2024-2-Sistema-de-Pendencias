from rest_framework import serializers
from dependencias_app.models.ped_ProEJA import PED_ProEJA
from dependencias_app.models.notificacao import Notificacao


class PED_ProEJA_Serializer(serializers.ModelSerializer):
    aluno = serializers.UUIDField()
    professor_disciplina = serializers.UUIDField()
    curso = serializers.UUIDField()
    periodo_letivo = serializers.UUIDField()
    disciplina = serializers.UUIDField()

    class Meta:
        model = PED_ProEJA
        fields = '__all__'