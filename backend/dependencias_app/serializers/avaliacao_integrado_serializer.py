from rest_framework import serializers
from ..models.avaliacao_integrado import AvaliacaoIntegrado
from datetime import datetime

class AvaliacaoIntegradoSerializer(serializers.ModelSerializer):
    data_entrega = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = AvaliacaoIntegrado
        fields = '__all__'

    def validate(self, data):
        atividade_id = data.get('atividade')
        ped = data.get('ped')
        
        avaliacao_existente = AvaliacaoIntegrado.objects.filter(ped_id=ped, atividade_id=atividade_id).first()

        # Se a avaliação já existe e a nota já foi definida
        if avaliacao_existente and avaliacao_existente.nota is not None:
            nova_nota = data.get('nota')
            if nova_nota is None or nova_nota == '':
                raise serializers.ValidationError({"Nota": "Não é permitido anular a nota de uma atividade após ser registrada."})

        data_entrega = data.get('data_entrega', None)
        
        if data_entrega < datetime.today().date() or data_entrega == None or data_entrega == '':
            raise serializers.ValidationError('A data de entrega da atividade não pode estar vazia ou ser inferior ao dia de hoje!')


        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        

        return representation
