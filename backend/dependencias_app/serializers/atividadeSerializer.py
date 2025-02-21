from rest_framework import serializers
from dependencias_app.models.atividade import Atividade_EMI, Atividade_ProEJA
from dependencias_app.utils.manage_files import get_from_drive


class Atividade_EMI_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade_EMI
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'listar':
            representation.pop('drive_id')
            representation.pop('professor')
            retorno['modalidade'] = 'Integrado'

        return representation

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
            representation.pop('professor')
            representation['modalidade'] = 'ProEJA'
        elif retorno == 'detalhes':
            representation['arquivo'] = get_from_drive(representation['drive_id'], request.user.grupo.name)
            representation.pop('drive_id')

        return representation
