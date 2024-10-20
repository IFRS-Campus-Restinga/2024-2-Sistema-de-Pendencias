from rest_framework import serializers
from dependencias_app.models.turma import Turma

class TurmaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turma
        fields = '__all__'


