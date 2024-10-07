from rest_framework import serializers
from dependencias_app.models.servidor import Servidor

class ServidorSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = Servidor
        fields = '__all__'
