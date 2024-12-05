from rest_framework import serializers
from datetime import datetime
from dependencias_app.models.observacao import Observacao

class ObservacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observacao
        fields = '__all__'
    
    
