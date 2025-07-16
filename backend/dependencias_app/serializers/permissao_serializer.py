from rest_framework import serializers
from django.contrib.auth.models import Permission
from dependencias_app.utils.formatters.format_permissao_data import FormatPermissaoData

class PermissaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'
        
    def to_representation(self, instance):
        request = self.context.get('request')
        retorno = request.GET.get("retorno", None)

        if not retorno:
            raise serializers.ValidationError('O campo retorno não pode ser nulo.')
        
        match retorno:
            case 'lista':
                return FormatPermissaoData.list_format(instance)
            case _:
                raise serializers.ValidationError('Formato de retorno inválido')