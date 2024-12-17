from rest_framework import serializers
from dependencias_app.models.aluno import Aluno

class ConselhoDeClasseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConselhoDeClasse
        fields = '__all__'

    def save(self, **kwargs):
        formConselhoDeClasse = super().save(**kwargs)

        formConselhoDeClasse.full_clean()
        formConselhoDeClasse.save()
        return formConselhoDeClasse
