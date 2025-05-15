from rest_framework import serializers
from dependencias_app.models.professor_progressao import Professor_Progressao_EMI, Professor_Progressao_ProEJA

class Professor_PED_EMI_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Professor_Progressao_EMI
        fields = '__all__'

class Professor_PED_ProEJA_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Professor_Progressao_ProEJA
        fields = '__all__'