from rest_framework import serializers
from datetime import datetime
from dependencias_app.models.atividade import Atividade_EMI, Atividade_ProEJA
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer


class Atividade_EMI_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade_EMI
        fields = '__all__'


class Atividade_ProEJA_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade_ProEJA
        fields = '__all__'
