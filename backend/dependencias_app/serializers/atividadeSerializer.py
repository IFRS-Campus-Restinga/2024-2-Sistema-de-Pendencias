from rest_framework import serializers
from dependencias_app.models.atividade import Atividade
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer

class AtividadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Adiciona o aluno ao serializer, se disponível
        if hasattr(instance, 'aluno'):
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data
        return representation