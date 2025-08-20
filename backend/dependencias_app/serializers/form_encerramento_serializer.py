from rest_framework import serializers
from dependencias_app.models.form_encerramento import FormEncerramentoIntegrado, FormEncerramentoProEJA

class FormEncerramentoIntegradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormEncerramentoIntegrado
        fields = '__all__'
    
class FormEncerramentoProEJASerializer(serializers.ModelSerializer):
    class Meta:
        model = FormEncerramentoProEJA
        fields = '__all__'