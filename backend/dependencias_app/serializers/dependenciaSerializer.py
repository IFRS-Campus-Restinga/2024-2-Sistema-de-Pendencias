from rest_framework import serializers
from dependencias_app.models.dependencia import Dependencia  

class DependenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dependencia
        fields = ['status', 'datainicio', 'datafim', 'notafinal', 'situacao', 'observacao']  
