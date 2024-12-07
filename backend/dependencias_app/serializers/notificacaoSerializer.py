from rest_framework import serializers
from dependencias_app.models.notificacao import Notificacao

class NotificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacao
        fields = '__all__'