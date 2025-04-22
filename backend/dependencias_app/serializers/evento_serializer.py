from rest_framework import serializers
from dependencias_app.models.evento import Evento
from dependencias_app.serializers.calendario_academico_serializer import Calendario_Academico_Serializer
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
        instance = self.instance

        if data_fim and data_inicio and data_fim < data_inicio:
            raise serializers.ValidationError('Data final não pode ser inferior à data de início do evento')

        if not dia_todo:
            if not hora_inicio or not hora_fim:
                raise serializers.ValidationError('Horário de início e fim são obrigatórios quando o evento não dura o dia todo')
            
            if data_inicio == data_fim and hora_inicio >= hora_fim:
                raise serializers.ValidationError('Horário de início deve ser anterior ao horário de fim')
            
        if instance and hasattr(instance, 'calendario'):
            if data_inicio > instance.calendario.data_fim or data_inicio < instance.calendario.data_inicio or data_fim < instance.calendario.data_inicio or data_fim > instance.calendario.data_fim:
                raise serializers.ValidationError('As datas de início e fim de um evento devem estar dentro do calendário ao qual pertencem.')

        return data
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')


        if retorno != 'detalhes':
            data_inicio = instance.data_inicio
            data_fim = instance.data_fim
            hora_inicio = instance.hora_inicio
            hora_fim = instance.hora_fim

            if data_inicio and hora_inicio:
                # Junta data + hora para 'start'
                data_inicio_datetime = datetime.datetime.combine(data_inicio, hora_inicio)
                representation['data_inicio'] = data_inicio_datetime.strftime('%Y-%m-%dT%H:%M:%S')
            elif data_inicio:
                representation['data_inicio'] = data_inicio.strftime('%Y-%m-%dT%H:%M:%S')
            else:
                representation['data_inicio'] = None

            if data_fim and hora_fim:
                data_fim_datetime = datetime.datetime.combine(data_fim, hora_fim)
                representation['data_fim'] = data_fim_datetime.strftime('%Y-%m-%dT%H:%M:%S')
            elif data_fim:
                representation['data_fim'] = data_fim.strftime('%Y-%m-%dT%H:%M:%S')
            else:
                representation['data_fim'] = None

            representation['allDay'] = instance.dia_todo

            representation.pop('hora_inicio', None)
            representation.pop('hora_fim', None)
            representation.pop('dia_todo', None)
        else:
            representation['evento'] = {
                'titulo': instance.titulo,
                'descricao': instance.descricao,
                'data_inicio': instance.data_inicio,
                'data_fim': instance.data_fim,
                'hora_inicio': instance.hora_inicio,
                'hora_fim': instance.hora_fim,
                'dia_todo': instance.dia_todo,
            }
            representation['calendario'] = Calendario_Academico_Serializer(instance.calendario).data

            representation.pop('data_inicio')
            representation.pop('data_fim')
            representation.pop('hora_inicio')
            representation.pop('hora_fim')
            representation.pop('titulo')
            representation.pop('dia_todo')
            representation.pop('descricao')
    

        return representation
