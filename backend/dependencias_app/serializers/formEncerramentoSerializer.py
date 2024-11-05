from rest_framework import serializers
from dependencias_app.models.formEncerramento import FormEncerramento

class FormEncerramentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormEncerramento
        fields = '__all__'

    def save(self, **kwargs):
        formEncerramento = super().save(**kwargs)

        formEncerramento.full_clean()
        formEncerramento.save()
        return formEncerramento