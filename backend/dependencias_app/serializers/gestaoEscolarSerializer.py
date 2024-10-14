from rest_framework import serializers
from dependencias_app.models.gestaoEscolar import GestaoEscolar

class GestaoEscolarSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = GestaoEscolar
        fields = '__all__'