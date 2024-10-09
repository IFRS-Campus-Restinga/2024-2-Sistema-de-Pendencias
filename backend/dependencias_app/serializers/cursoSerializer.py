from rest_framework import serializers

from dependencias_app.models import Curso


class CursoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Curso
        fields = '__all__'