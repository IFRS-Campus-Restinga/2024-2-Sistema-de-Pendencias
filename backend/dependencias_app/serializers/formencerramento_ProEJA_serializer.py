from rest_framework import serializers
from ..models.formencerramento_proeja import FormEncerramentoProEJA

class FormEncerramentoProEJASerializer(serializers.ModelSerializer):

    class Meta:
        model = FormEncerramentoProEJA
        fields = '__all__'