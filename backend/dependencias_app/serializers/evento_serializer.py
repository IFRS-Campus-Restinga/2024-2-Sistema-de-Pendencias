from rest_framework import serializers
from dependencias_app.models.evento import Evento

class Evento_Serializer(serializers.ModelSerializer):

    class Meta:
        model = Evento
        fields = '__all__'

    def save(self, **kwargs):
        formEvento = super().save(**kwargs)

        formEvento.full_clean()
        formEvento.save()
        return formEvento

    def validate(self, data):
        data_fim = data.get('data_fim')
        data_inicio = data.get('data_inicio')

        if data_fim < data_inicio: raise serializers.ValidationError('Data final não pode ser inferior a data de início do evento')

        return data