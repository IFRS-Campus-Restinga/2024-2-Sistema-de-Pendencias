from rest_framework import serializers
from dependencias_app.models.atividade_integrado import AtividadeIntegrado
from dependencias_app.utils.manage_files import get_from_drive


class AtividadeIntegradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AtividadeIntegrado
        fields = '__all__'