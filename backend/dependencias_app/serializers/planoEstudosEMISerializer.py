from rest_framework import serializers
from dependencias_app.models.planoEstudosEMI import PlanoEstudos_EMI

class PlanoEstudos_EMISerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoEstudos_EMI
        fields = '__all__'

    def save(self, **kwargs):
        formPlanoEstudo = super().save(**kwargs)
        formPlanoEstudo.full_clean()
        formPlanoEstudo.save()
        return formPlanoEstudo