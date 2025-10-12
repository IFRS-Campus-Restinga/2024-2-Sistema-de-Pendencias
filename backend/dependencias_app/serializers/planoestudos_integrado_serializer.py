from rest_framework import serializers
from ..models.ped_integrado import PEDIntegrado
from ..models.planoestudos_integrado import PlanoEstudosIntegrado

class PlanoEstudosIntegradoSerializer(serializers.ModelSerializer):
    ped = serializers.PrimaryKeyRelatedField(queryset=PEDIntegrado.objects.all())

    class Meta:
        model = PlanoEstudosIntegrado
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        return representation