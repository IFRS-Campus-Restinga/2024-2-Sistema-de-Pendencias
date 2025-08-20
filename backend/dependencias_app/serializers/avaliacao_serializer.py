from rest_framework import serializers
from dependencias_app.models.avaliacao import *
from datetime import datetime

class Avaliacao_EMI_Serializer(serializers.ModelSerializer):
    data_entrega = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = AvaliacaoAtividadeIntegrado
        fields = '__all__'

    def validate(self, data):
        atividade_id = data.get('atividade')
        ped = data.get('ped')
        
        avaliacao_existente = AvaliacaoAtividadeIntegrado.objects.filter(ped_id=ped, atividade_id=atividade_id).first()

        # Se a avaliação já existe e a nota já foi definida
        if avaliacao_existente and avaliacao_existente.nota is not None:
            nova_nota = data.get('nota')
            if nova_nota is None or nova_nota == '':
                raise serializers.ValidationError(f"Não é permitido remover a nota de uma atividade após ser registrada.")

        data_entrega = data.get('data_entrega', None)
        
        if data_entrega < datetime.today().date() or data_entrega == None or data_entrega == '':
            raise serializers.ValidationError('A data de entrega da atividade não pode estar vazia ou ser inferior ao dia de hoje!')


        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['titulo'] = instance.atividade.titulo
        representation['descricao'] = instance.atividade.descricao

        representation.pop('atividade')
        representation.pop('ped')

        return representation

class Avaliacao_ProEJA_Serializer(serializers.ModelSerializer):
    data_entrega = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = AvaliacaoAtividadeProEJA
        fields = '__all__'
    
    def validate(self, data):
        atividade_id = data.get('atividade')
        ped = data.get('ped')
        
        try:
            avaliacao_existente = AvaliacaoAtividadeProEJA.objects.filter(ped_id=ped, atividade_id=atividade_id).first()

            # Se a avaliação já existe e a nota já foi definida
            if avaliacao_existente and avaliacao_existente.nota is not None:
                nova_nota = data.get('nota')
                if nova_nota is None or nova_nota == '':
                    raise serializers.ValidationError(f"Não é permitido remover a nota de uma atividade após ser registrada.")

            data_entrega = datetime.strptime(self.validated_data.get('data_entrega'), "%Y-%m-%d").date()
            
            if data_entrega < datetime.today().date(): raise serializers.ValidationError('A data de entrega da atividade não pode ser inferior ao dia de hoje!')

        except serializers.ValidationError as e:
            return str(e)


        return data  

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['titulo'] = instance.atividade.titulo
        representation['descricao'] = instance.atividade.descricao

        representation.pop('atividade')
        representation.pop('ped')

        return representation
