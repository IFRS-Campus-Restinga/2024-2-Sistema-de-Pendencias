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
