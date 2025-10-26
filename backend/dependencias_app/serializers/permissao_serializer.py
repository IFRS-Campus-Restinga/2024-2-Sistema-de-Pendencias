from rest_framework import serializers
from django.contrib.auth.models import Permission
from ..formatters.format_permissao_data import URLFieldsParser
from django.utils.translation import gettext as _

class PermissaoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Permission
        fields = '__all__' 

    def to_representation(self, instance):
        request = self.context.get('request')
        retorno = request.GET.get("retorno", None)

        if not retorno:
            raise serializers.ValidationError('O campo retorno não pode ser nulo.')

        instance.name = _(instance.name)

        # aplica URLFieldsParser sobre a representação
        return URLFieldsParser.parse(instance, retorno)
