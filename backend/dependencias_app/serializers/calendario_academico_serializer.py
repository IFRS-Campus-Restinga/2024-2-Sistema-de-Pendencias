
from django.db.models import Q
from django.core.exceptions import ValidationError
from rest_framework import serializers
from dependencias_app.models.calendario_academico import Calendario_Academico

class Calendario_Academico_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Calendario_Academico
        fields = '__all__'

    def save(self, **kwargs):
        formCalendarioAcademico = super().save(**kwargs)
        formCalendarioAcademico.full_clean()
        formCalendarioAcademico.save()
        return formCalendarioAcademico
    
    def validate_titulo(self, value):
        titulo = value.strip()

        if len(titulo) < 3:
            raise serializers.ValidationError("O titulo do calendário deve ter pelo menos 3 caracteres.")

        if len(titulo) > 100:
            raise serializers.ValidationError("O titulo do calendário deve ter no máximo 100 caracteres.")

        if not titulo:
            raise serializers.ValidationError("O titulo do calendário não pode estar vazio ou conter apenas espaços.")

        return titulo
    
    def validate_tipo_calendario(self, value):
        if value != 'Integrado' and value != 'ProEJA': 
            raise serializers.ValidationError('Modalidade inválida')
        return value
    
    def validate(self, data):
        data_inicio = data.get('data_inicio')
        data_final = data.get('data_fim')
        tipo_calendario = data.get('tipo_calendario')
        instance = self.instance 

        if data_inicio == data_final: 
            raise serializers.ValidationError('As datas de início e fim de um calendário não podem ser iguais')

        if data_final < data_inicio:
            raise serializers.ValidationError('A data final não pode ser anterior à data de início')

        queryset = Calendario_Academico.objects.filter(tipo_calendario=tipo_calendario)
        
        if instance is not None:
            queryset = queryset.exclude(pk=instance.pk)

        overlapping_calendars = queryset.filter(
             Q (data_inicio__lte=data_final, data_fim__gte=data_inicio) | 
             Q (data_inicio__gte=data_inicio, data_fim__lte=data_final)
        ).exists()

        if overlapping_calendars:
            raise serializers.ValidationError(
                'Já existe um calendário deste tipo com datas que se sobrepõem ao período informado'
            )
        
        if instance and hasattr(instance, 'eventos'):
            for evento in instance.eventos.all():
                if evento.data_inicio < data_inicio or evento.data_inicio > data_final:
                    raise serializers.ValidationError('Existem eventos cadastrados em períodos fora das datas de início e final fornecidos.')
        
        return data