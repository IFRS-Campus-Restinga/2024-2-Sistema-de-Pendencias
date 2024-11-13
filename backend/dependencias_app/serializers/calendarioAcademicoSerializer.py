from rest_framework import serializers
from dependencias_app.models.calendarioAcademico import CalendarioAcademico

class CalendarioAcademicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarioAcademico
        fields = '__all__'

    def save(self, **kwargs):
        formCalendarioAcademico = super().save(**kwargs)

        formCalendarioAcademico.full_clean()
        formCalendarioAcademico.save()
        return formCalendarioAcademico