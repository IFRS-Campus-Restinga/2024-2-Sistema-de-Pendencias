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

    def validate_numero(self, value):
        numero = str(value).strip()

        if len(numero) != 3:
            raise serializers.ValidationError("O número da turma deve ter exatamente 3 caracteres.")

        if not numero.isdigit():
            raise serializers.ValidationError("O número da turma deve conter apenas números")

        return value
