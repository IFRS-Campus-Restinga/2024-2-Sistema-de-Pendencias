from rest_framework import serializers
from dependencias_app.models.atividade import *
from dependencias_app.serializers.pedEMISerializer import PED_EMI_Serializer
from dependencias_app.serializers.pedProEJASerializer import PED_ProEJA_Serializer

class Atividade_EMI_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade_EMI
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Adiciona o aluno ao serializer, se disponível
        if hasattr(instance, 'ped'):
            representation['ped'] = PED_EMI_Serializer(instance.ped).data
        return representation
    
class Atividade_ProEJA_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade_ProEJA
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Adiciona o aluno ao serializer, se disponível
        if hasattr(instance, 'ped'):
            representation['ped'] = PED_ProEJA_Serializer(instance.ped).data
        return representation