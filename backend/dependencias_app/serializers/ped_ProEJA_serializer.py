from rest_framework import serializers
from dependencias_app.models.ped_ProEJA import PEDProEJA
from dependencias_app.models.notificacao import Notificacao


class PEDProEJASerializer(serializers.ModelSerializer):
    aluno = serializers.UUIDField()
    professor_disciplina = serializers.UUIDField()
    curso = serializers.UUIDField()
    periodo_letivo = serializers.UUIDField()
    disciplina = serializers.UUIDField()

    class Meta:
        model = PEDProEJA        
        fields = '__all__'