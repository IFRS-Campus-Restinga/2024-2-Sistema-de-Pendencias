from rest_framework import serializers
from dependencias_app.models.planoEstudosProEJA import PlanoEstudos_ProEJA

class PlanoEstudos_ProEJASerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoEstudos_ProEJA
        fields = '__all__'

    def save(self, **kwargs):
        formPlanoEstudo = super().save(**kwargs)
        formPlanoEstudo.full_clean()
        formPlanoEstudo.save()
        return formPlanoEstudo
