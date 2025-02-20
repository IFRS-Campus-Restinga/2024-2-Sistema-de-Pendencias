from rest_framework import serializers
from dependencias_app.models.avaliacao import *

import logging

logger = logging.getLogger(__name__)

class Avaliacao_EMI_Serializer(serializers.ModelSerializer):
    data_entrega = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Avaliacao_Atividade_EMI
        fields = '__all__'

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
