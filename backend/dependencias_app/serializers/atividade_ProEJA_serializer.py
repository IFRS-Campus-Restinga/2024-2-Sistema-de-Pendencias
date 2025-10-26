from rest_framework import serializers
from dependencias_app.models.atividade_proeja import AtividadeProEJA
from dependencias_app.utils.manage_files import get_from_drive

class AtividadeProEJASerializer(serializers.ModelSerializer):
    class Meta:
        model = AtividadeProEJA
        fields = '__all__'