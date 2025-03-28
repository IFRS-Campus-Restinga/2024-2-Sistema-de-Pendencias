from rest_framework import serializers
from dependencias_app.models.notificacao import Notificacao

class Notificacao_Serializer(serializers.ModelSerializer):
    data = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Notificacao
        fields = '__all__'