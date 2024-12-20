from datetime import datetime
from rest_framework import serializers

class AtividadeXLSXSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        
    def validate(self, attrs):
        for field in ['data_criacao', 'data_de_entrega']:
            if isinstance(data.get(field), str):
                try:
                    data[field] = datetime.strptime(data[field], '%Y-%m-%d')
                except ValueError:
                    raise serializers.ValidationError({field: f"{field} inválida. Use o formato YYYY-MM-DD."})
        attrs['nota'] = attrs.get('nota', 0)
        
        if 'tituto' is null:
            raise serializers.ValidationError({'titulo': 'Informe o título da atividade.'})
        
        return super().validate(attrs)