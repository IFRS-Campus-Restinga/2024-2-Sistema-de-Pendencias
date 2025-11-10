from rest_framework import serializers
from ..models.ped_integrado import PEDIntegrado
from ..models.planoestudos_integrado import PlanoEstudosIntegrado
from ..formatters.format_plano_estudos import URLFieldsParser

class PlanoEstudosIntegradoSerializer(serializers.ModelSerializer):
    ped = serializers.PrimaryKeyRelatedField(queryset=PEDIntegrado.objects.all())
    drive_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = PlanoEstudosIntegrado
        fields = '__all__'
    
    def validate(self, attrs):
        turno = attrs.get('turno')

        if turno == 'Noite':
            raise serializers.ValidationError({
                'turno': 'Progressões desta modalidade não podem ocorrer à noite'
            })

        return super().validate(attrs)

    def to_representation(self, instance):
        request = self.context.get('request')
        retorno = request.GET.get("retorno", None)

        if not retorno:
            raise serializers.ValidationError('O campo retorno não pode ser nulo.')

        return URLFieldsParser.parse(instance, retorno)