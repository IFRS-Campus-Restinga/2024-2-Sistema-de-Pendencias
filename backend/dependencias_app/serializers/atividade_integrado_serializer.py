from rest_framework import serializers
from dependencias_app.models.atividade_integrado import AtividadeIntegrado
from ..formatters.format_atividade import URLFieldsParser
from ..models.usuario import Usuario

class AtividadeIntegradoSerializer(serializers.ModelSerializer):
    professor = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.filter(group__name='professor'))
    
    class Meta:
        model = AtividadeIntegrado
        fields = '__all__' 

    def to_representation(self, instance):
        request = self.context.get('request')
        retorno = request.GET.get("retorno", None)

        if not retorno:
            raise serializers.ValidationError('O campo retorno não pode ser nulo.')

        return URLFieldsParser.parse(instance, retorno)