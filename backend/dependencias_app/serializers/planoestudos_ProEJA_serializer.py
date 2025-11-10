from rest_framework import serializers
from ..models.ped_proeja import PEDProeja
from ..models.planoestudos_proeja import PlanoEstudosProeja
from ..formatters.format_plano_estudos import URLFieldsParser

class PlanoEstudosProejaSerializer(serializers.ModelSerializer):
    ped = serializers.PrimaryKeyRelatedField(queryset=PEDProeja.objects.all())
    drive_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = PlanoEstudosProeja
        fields = '__all__'
        
    def to_representation(self, instance):
        request = self.context.get('request')
        retorno = request.GET.get("retorno", None)

        if not retorno:
            raise serializers.ValidationError('O campo retorno não pode ser nulo.')

        return URLFieldsParser.parse(instance, retorno)