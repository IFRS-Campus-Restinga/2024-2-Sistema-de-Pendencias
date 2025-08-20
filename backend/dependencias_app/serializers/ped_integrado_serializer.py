from rest_framework import serializers
from dependencias_app.models.ped_integrado import PEDIntegrado
from dependencias_app.models.notificacao import Notificacao

class PEDIntegradoSerializer(serializers.ModelSerializer):
    aluno = serializers.UUIDField()
    professor_disciplina = serializers.UUIDField()
    curso = serializers.UUIDField()
    disciplina = serializers.UUIDField()
    periodo_letivo = serializers.UUIDField()
    turma_atual = serializers.UUIDField()

    class Meta:
        model = PEDIntegrado
        fields = '__all__'

    def validate(self, attrs):
        peds = PEDIntegrado
            

        return super().validate(attrs)
    
    