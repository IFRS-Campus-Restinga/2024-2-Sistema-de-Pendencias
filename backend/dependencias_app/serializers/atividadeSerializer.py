from rest_framework import serializers
from dependencias_app.models.atividade import Atividade_EMI, Atividade_ProEJA
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from datetime import datetime

class Atividade_EMI_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade_EMI
        fields = '__all__'  # Inclui todos os campos, incluindo 'nota'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Formatar data_criacao
        if instance.data_criacao:
            representation['data_criacao'] = instance.data_criacao.strftime('%Y-%m-%d')  # Formato YYYY-MM-DD

        # Formatar data_de_entrega
        if instance.data_de_entrega:
            representation['data_de_entrega'] = instance.data_de_entrega.strftime('%Y-%m-%d')  # Formato YYYY-MM-DD

        # Caso tenha um aluno, adicionar os dados
        if hasattr(instance, 'aluno'):
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data

        return representation

    def validate_data_criacao(self, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, '%Y-%m-%d')  # Garantir o formato correto
            except ValueError:
                raise serializers.ValidationError("Data de criação inválida. Use o formato YYYY-MM-DD.")
        return value

    def validate_data_de_entrega(self, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, '%Y-%m-%d')  # Garantir o formato correto
            except ValueError:
                raise serializers.ValidationError("Data de entrega inválida. Use o formato YYYY-MM-DD.")
        return value

    def validate_nota(self, value):
        # Se 'value' for None, definir como 0
        if value is None:
            return 0
        return value

    def create(self, validated_data):
        # Garantir que a 'nota' seja 0 se não estiver presente
        validated_data['nota'] = validated_data.get('nota', 0)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Ao atualizar, garantimos que a nota seja aceita
        nota = validated_data.get('nota', None)
        if nota is None:
            validated_data['nota'] = instance.nota  # Se a nota não for enviada, mantemos a nota atual
        return super().update(instance, validated_data)


class Atividade_ProEJA_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade_ProEJA
        fields = '__all__'  # Inclui todos os campos, incluindo 'nota'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Formatar data_criacao
        if instance.data_criacao:
            representation['data_criacao'] = instance.data_criacao.strftime('%Y-%m-%d')  # Formato YYYY-MM-DD

        # Formatar data_de_entrega
        if instance.data_de_entrega:
            representation['data_de_entrega'] = instance.data_de_entrega.strftime('%Y-%m-%d')  # Formato YYYY-MM-DD

        # Caso tenha um aluno, adicionar os dados
        if hasattr(instance, 'aluno'):
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data

        return representation

    def validate_data_criacao(self, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, '%Y-%m-%d')  # Garantir o formato correto
            except ValueError:
                raise serializers.ValidationError("Data de criação inválida. Use o formato YYYY-MM-DD.")
        return value

    def validate_data_de_entrega(self, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, '%Y-%m-%d')  # Garantir o formato correto
            except ValueError:
                raise serializers.ValidationError("Data de entrega inválida. Use o formato YYYY-MM-DD.")
        return value

    def validate_nota(self, value):
        # Se 'value' for None, definir como 0
        if value is None:
            return 0
        return value

    def create(self, validated_data):
        # Garantir que a 'nota' seja 0 se não estiver presente
        validated_data['nota'] = validated_data.get('nota', 0)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Ao atualizar, garantimos que a nota seja aceita
        nota = validated_data.get('nota', None)
        if nota is None:
            validated_data['nota'] = instance.nota  # Se a nota não for enviada, mantemos a nota atual
        return super().update(instance, validated_data)
