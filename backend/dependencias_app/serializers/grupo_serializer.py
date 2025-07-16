from rest_framework import serializers
from django.contrib.auth.models import Group
from dependencias_app.utils.formatters.format_grupo_data import FormatGrupoData
from dependencias_app.models.group_map import GroupUUIDMap

class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'
        
    def to_representation(self, instance):
        request = self.context.get('request')
        retorno = request.GET.get("retorno", None)

        if not retorno:
            raise serializers.ValidationError('O campo retorno não pode ser nulo.')
        
        match retorno:
            case 'lista':
                return FormatGrupoData.list_format(instance)
            case 'detalhes':
                return FormatGrupoData.details_format(instance)
            case _:
                raise serializers.ValidationError("Formato de retorno inválido")

    def create(self, validated_data):
        permissions = validated_data.pop('permissions', [])
        
        grupo = Group.objects.create(**validated_data)

        # Define as permissões do grupo (caso haja)
        if permissions:
            grupo.permissions.set(permissions)

        # Cria o mapeamento UUID
        GroupUUIDMap.objects.create(group=grupo)

        return grupo

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        # Remove do grupo apenas as permissões recebidas
        if 'permissions' in validated_data:
            permissions_to_remove = validated_data['permissions']
            instance.permissions.remove(*permissions_to_remove)

        return instance