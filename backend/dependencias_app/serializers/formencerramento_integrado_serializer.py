from rest_framework import serializers
from ..models.formencerramento_integrado import FormEncerramentoIntegrado

class FormEncerramentoIntegradoSerializer(serializers.ModelSerializer):

    class Meta:
        model = FormEncerramentoIntegrado
        fields = '__all__'