from rest_framework import serializers
from django.contrib.auth.models import Group
from dependencias_app.utils.formatters.format_group_data import FormatGroupData

class Grupo_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'
        
    def to_representation(self, instance):
        request = self.context.get('request')
        data_format = request.GET.get("data_format", None)

        if not data_format:
            raise serializers.ValidationError('O campo data_format não pode ser nulo.')
        
        match data_format:
            case 'list':
                return FormatGroupData.list_format(instance)
            case 'details':
                return FormatGroupData.details_format(instance)