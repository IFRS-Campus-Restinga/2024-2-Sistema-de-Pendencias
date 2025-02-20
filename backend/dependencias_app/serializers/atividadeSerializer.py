from rest_framework import serializers
from dependencias_app.models.atividade import Atividade_EMI, Atividade_ProEJA


class Atividade_EMI_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade_EMI
        fields = '__all__'


class Atividade_ProEJA_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade_ProEJA
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'listar':
            representation.pop('drive_id')

        return representation
