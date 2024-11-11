from rest_framework import serializers
from dependencias_app.models.atividade import Atividade
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer

class Atividade_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if hasattr(instance, 'aluno'):
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data
        return representation
