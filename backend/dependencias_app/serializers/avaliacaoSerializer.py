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

    def validate(self, data):
        atividade_id = data.get('atividade')
        ped = self.context['ped']
        
        try:
            avaliacao_existente = Avaliacao_Atividade_EMI.objects.get(ped=ped, atividade_id=atividade_id)
            if avaliacao_existente.DoesNotExist: raise serializers.ValidationError('Avaliação não existente')

            # Se a avaliação já existe e a nota já foi definida
            if avaliacao_existente.nota is not None:
                nova_nota = data.get('nota')
                if nova_nota is None or nova_nota == '':
                    raise serializers.ValidationError(f"Não é permitido remover a nota de uma atividade após ser registrada.")

            data_entrega = datetime.strptime(self.validated_data.get('data_entrega'), "%Y-%m-%d").date()
            
            if data_entrega < datetime.today().date(): raise serializers.ValidationError('A data de entrega da atividade não pode ser inferior ao dia de hoje!')

        except Avaliacao_Atividade_EMI.DoesNotExist:
            avaliacao_existente = None


        return data

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
