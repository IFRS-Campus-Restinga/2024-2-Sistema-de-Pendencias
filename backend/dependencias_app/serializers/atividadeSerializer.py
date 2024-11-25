from rest_framework import serializers
from datetime import datetime
from dependencias_app.models.atividade import Atividade_EMI, Atividade_ProEJA
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer


class BaseAtividadeSerializer(serializers.ModelSerializer):
    aluno = serializers.PrimaryKeyRelatedField(
        queryset=UsuarioBaseSerializer.Meta.model.objects.all(), required=False
    )
    nota = serializers.FloatField(required=False)

    class Meta:
        fields = '__all__'

    def validate(self, attrs):
        # Validar datas
        for field in ['data_criacao', 'data_de_entrega']:
            if isinstance(attrs.get(field), str):
                try:
                    attrs[field] = datetime.strptime(attrs[field], '%Y-%m-%d')
                except ValueError:
                    raise serializers.ValidationError({field: f"{field} inválida. Use o formato YYYY-MM-DD."})

        # Garantir que a nota seja 0 se não estiver definida
        attrs['nota'] = attrs.get('nota', 0)

        return super().validate(attrs)

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Formatar datas
        if instance.data_criacao:
            representation['data_criacao'] = instance.data_criacao.strftime('%Y-%m-%d')
        if instance.data_de_entrega:
            representation['data_de_entrega'] = instance.data_de_entrega.strftime('%Y-%m-%d')

        # Adicionar dados do aluno se disponíveis
        if hasattr(instance, 'aluno') and instance.aluno:
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data

        return representation

    def save(self, **kwargs):
        instance = super().save(**kwargs)

        # Validação completa com full_clean
        instance.full_clean()
        instance.save()
        return instance


class Atividade_EMI_Serializer(BaseAtividadeSerializer):
    class Meta(BaseAtividadeSerializer.Meta):
        model = Atividade_EMI


class Atividade_ProEJA_Serializer(BaseAtividadeSerializer):
    class Meta(BaseAtividadeSerializer.Meta):
        model = Atividade_ProEJA
