from rest_framework import serializers
from ..models.ped_proeja import PEDProEJA
from ..models.planoestudos_proeja import PlanoEstudosProEJA
from ..formatters.format_plano_estudos import URLFieldsParser

class PlanoEstudosProEJASerializer(serializers.ModelSerializer):
    ped = serializers.PrimaryKeyRelatedField(queryset=PEDProEJA.objects.all())
    drive_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = PlanoEstudosProEJA
        fields = '__all__'
        
    def to_representation(self, instance):
        request = self.context.get('request')
        retorno = request.GET.get("retorno", None)

        if not retorno:
            raise serializers.ValidationError('O campo retorno não pode ser nulo.')

        return URLFieldsParser.parse(instance, retorno)