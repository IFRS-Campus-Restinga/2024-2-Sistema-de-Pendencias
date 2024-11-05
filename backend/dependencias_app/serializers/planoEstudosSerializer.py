from rest_framework import serializers
from dependencias_app.models.planoEstudos import PlanoEstudos

class PlanoEstudosSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoEstudos
        fields = '__all__'
    
    def save(self, **kwargs):
        formPlanoEstudos = super().save(**kwargs)

        formPlanoEstudos.full_clean()
        formPlanoEstudos.save()
        return formPlanoEstudos