from rest_framework import serializers
from dependencias_app.models.ppt import PPT

class PPTSerializer(serializers.ModelSerializer):
    class Meta:
        model = PPT
        fields = '__all__'