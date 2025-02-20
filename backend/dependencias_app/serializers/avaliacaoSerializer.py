from rest_framework import serializers
from dependencias_app.models.avaliacao import *
import datetime

import logging

logger = logging.getLogger(__name__)

class Avaliacao_EMI_Serializer(serializers.ModelSerializer):
    data_entrega = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Avaliacao_Atividade_EMI
        fields = '__all__'

    def validate(self, attrs):
        data_entrega = datetime.strptime(self.validated_data.get('data_entrega'), "%Y-%m-%d").date()
        
        if data_entrega < datetime.today().date(): raise serializers.ValidationError('A data de entrega da atividade não pode ser inferior ao dia de hoje!')

        return super().validate(attrs)

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['titulo'] = instance.atividade.titulo
        representation['descricao'] = instance.atividade.descricao

        return representation

class Avaliacao_ProEJA_Serializer(serializers.ModelSerializer):
    data_entrega = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Avaliacao_Atividade_ProEJA
        fields = '__all__'
    

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['titulo'] = instance.atividade.titulo
        representation['descricao'] = instance.atividade.descricao

        return representation
