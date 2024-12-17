from rest_framework import serializers
from dependencias_app.models.conselhoDeClasse import ConselhoDeClasse

class ConselhodeClasseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConselhoDeClasse
        fields = '__all__'

    def save(self, **kwargs):
        formConselhodeClasse = super().save(**kwargs)

        formConselhodeClasse.full_clean()
        formConselhodeClasse.save()
        return formConselhodeClasse