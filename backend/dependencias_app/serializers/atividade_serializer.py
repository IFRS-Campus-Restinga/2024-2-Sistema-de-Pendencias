from rest_framework import serializers
from dependencias_app.models.atividade import Atividade_EMI, Atividade_ProEJA
from dependencias_app.utils.manage_files import get_from_drive


class Atividade_EMI_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade_EMI
        fields = '__all__'

class Atividade_ProEJA_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade_ProEJA
        fields = '__all__'
