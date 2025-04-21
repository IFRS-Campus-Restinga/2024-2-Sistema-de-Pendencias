from rest_framework import serializers
from dependencias_app.models.evento import Evento
import datetime

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
        hora_inicio = data.get('hora_inicio')
        hora_fim = data.get('hora_fim')
        dia_todo = data.get('dia_todo')

        if data_fim and data_inicio and data_fim < data_inicio:
            raise serializers.ValidationError('Data final não pode ser inferior à data de início do evento')

        if not dia_todo:
            if not hora_inicio or not hora_fim:
                raise serializers.ValidationError('Horário de início e fim são obrigatórios quando o evento não dura o dia todo')
            
            if data_inicio == data_fim and hora_inicio >= hora_fim:
                raise serializers.ValidationError('Horário de início deve ser anterior ao horário de fim')

        return data
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        data_inicio = instance.data_inicio
        data_fim = instance.data_fim
        hora_inicio = instance.hora_inicio
        hora_fim = instance.hora_fim

        if data_inicio and hora_inicio:
            # Junta data + hora para 'start'
            start_datetime = datetime.datetime.combine(data_inicio, hora_inicio)
            representation['start'] = start_datetime.strftime('%Y-%m-%dT%H:%M:%S')
        elif data_inicio:
            representation['start'] = data_inicio.strftime('%Y-%m-%dT%H:%M:%S')
        else:
            representation['start'] = None

        if data_fim and hora_fim:
            end_datetime = datetime.datetime.combine(data_fim, hora_fim)
            representation['end'] = end_datetime.strftime('%Y-%m-%dT%H:%M:%S')
        elif data_fim:
            representation['end'] = data_fim.strftime('%Y-%m-%dT%H:%M:%S')
        else:
            representation['end'] = None

        representation['allDay'] = instance.dia_todo
        representation['title'] = instance.titulo

        # Remove campos originais
        representation.pop('data_inicio', None)
        representation.pop('data_fim', None)
        representation.pop('hora_inicio', None)
        representation.pop('hora_fim', None)
        representation.pop('titulo', None)
        representation.pop('dia_todo', None)

        return representation
