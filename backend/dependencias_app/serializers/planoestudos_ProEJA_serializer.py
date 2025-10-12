from rest_framework import serializers
from ..models.ped_proeja import PEDProEJA
from ..models.planoestudos_proeja import PlanoEstudosProEJA

class PlanoEstudosProEJASerializer(serializers.ModelSerializer):
    ped = serializers.PrimaryKeyRelatedField(queryset=PEDProEJA.objects.all())

    class Meta:
        model = PlanoEstudosProEJA
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        
        return representation