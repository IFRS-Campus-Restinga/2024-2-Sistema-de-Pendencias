from rest_framework import serializers
from datetime import datetime
from dependencias_app.models.observacao import Observacao

class ObservacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observacao
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['data_insercao'] = instance.data_insercao.strftime('%d/%m/%Y %H:%M:%S')  # Formato de data
        return representation
