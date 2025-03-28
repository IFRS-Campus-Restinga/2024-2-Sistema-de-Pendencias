from rest_framework import serializers
from backend.dependencias_app.models.calendario_academico import Calendario_Academico

class Calendario_Academico_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Calendario_Academico
        fields = '__all__'

    def save(self, **kwargs):
        formCalendarioAcademico = super().save(**kwargs)

        formCalendarioAcademico.full_clean()
        formCalendarioAcademico.save()
        return formCalendarioAcademico