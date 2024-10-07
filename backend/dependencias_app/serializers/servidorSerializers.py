from rest_framework import serializers
from dependencias_app.models.servidor import Servidor

class ServidorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Servidor
        fields = '__all__'
