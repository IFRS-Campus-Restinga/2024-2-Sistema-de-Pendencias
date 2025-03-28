from rest_framework import serializers
from dependencias_app.models.observacao import Observacao

class Observacao_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Observacao
        fields = '__all__'
    
    
