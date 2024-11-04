from rest_framework import serializers
from dependencias_app.models import dependenciaemiped

class EmiPedSerializer(serializers.ModelSerializer):

    class Meta:
        model = dependenciaemiped
        fields = '__all__'  
