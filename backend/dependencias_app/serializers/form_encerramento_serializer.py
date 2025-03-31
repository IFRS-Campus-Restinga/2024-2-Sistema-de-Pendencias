from rest_framework import serializers
from dependencias_app.models.form_encerramento import Form_Encerramento

class Form_Encerramento_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Form_Encerramento
        fields = '__all__'

    def save(self, **kwargs):
        formEncerramento = super().save(**kwargs)

        formEncerramento.full_clean()
        formEncerramento.save()
        return formEncerramento