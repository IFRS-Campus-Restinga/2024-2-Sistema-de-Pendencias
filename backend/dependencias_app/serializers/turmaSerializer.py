from rest_framework import serializers
from dependencias_app.models.turma import Turma

class TurmaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turma
        fields = '__all__'
    
    def save(self, **kwargs):
        formTurma = super().save(**kwargs)

        formTurma.full_clean()
        formTurma.save()
        return formTurma


