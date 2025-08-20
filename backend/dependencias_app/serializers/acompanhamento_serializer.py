from rest_framework import serializers
from backend.dependencias_app.models.acompanhamento import Acompanhamento

class AcompanhamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Acompanhamento
        fields = '__all__'
    
    
