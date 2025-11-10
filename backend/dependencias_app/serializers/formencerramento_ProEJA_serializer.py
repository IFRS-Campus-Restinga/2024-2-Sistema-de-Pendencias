from rest_framework import serializers
from ..models.formencerramento_proeja import FormEncerramentoProeja

class FormEncerramentoProejaSerializer(serializers.ModelSerializer):

    class Meta:
        model = FormEncerramentoProeja
        fields = '__all__'