from rest_framework import serializers
from dependencias_app.models.atividade import AtividadePED_EMI, AtividadePED_ProEJA
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer

class AtividadePED_EMISerializer(serializers.ModelSerializer):
    class Meta:
        model = AtividadePED_EMI
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if hasattr(instance, 'aluno'):
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data
        return representation


class AtividadePED_ProEJASerializer(serializers.ModelSerializer):
    class Meta:
        model = AtividadePED_ProEJA
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if hasattr(instance, 'aluno'):
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data
        return representation