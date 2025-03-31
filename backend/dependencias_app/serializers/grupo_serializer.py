from rest_framework import serializers
from django.contrib.auth.models import Group

class Grupo_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'
        
    def to_representation(self, instance):
        return instance.name  # Retorna apenas o nome do grupo