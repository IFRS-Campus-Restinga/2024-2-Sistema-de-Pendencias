from ..models.usuario import Usuario
from rest_framework import serializers
from django.contrib.auth.models import Group
import uuid

class UsuarioSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField()
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

    class Meta:
        model = Usuario
        fields = '__all__'

    def create(self, validated_data):
        if isinstance(validated_data.get('id'), str):
            validated_data['id'] = uuid.UUID(validated_data['id'])
        
        return super().create(validated_data)
