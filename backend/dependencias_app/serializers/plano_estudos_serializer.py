from rest_framework import serializers
from dependencias_app.models.plano_estudos import *

class PlanoEstudosIntegradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plano_Estudos_EMI
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'aluno':
            representation.pop('parecer_pedagogico')

        return representation
    

class PlanoEstudosProEJASerializer(serializers.ModelSerializer):
    class Meta:
        model = Plano_Estudos_ProEJA
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'aluno':
            representation.pop('parecer_pedagogico')

        return representation