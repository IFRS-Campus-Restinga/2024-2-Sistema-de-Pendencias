from rest_framework import serializers
from django.utils import timezone
from dependencias_app.models.eventoCalendario import Evento

class EventoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Evento
        fields = '__all__'

    def save(self, **kwargs):
        formEvento = super().save(**kwargs)

        formEvento.full_clean()
        formEvento.save()
        return formEvento
