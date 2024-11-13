from rest_framework import serializers
from dependencias_app.models.planoEstudos import PlanoEstudos

class PlanoEstudos_Serializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoEstudos
        fields = '__all__'

    def save(self, **kwargs):
        formPlanoEstudo = super().save(**kwargs)
        formPlanoEstudo.full_clean()
        formPlanoEstudo.save()
        return formPlanoEstudo