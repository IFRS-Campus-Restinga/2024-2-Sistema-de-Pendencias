from rest_framework import serializers
from dependencias_app.models.coordenador import Coordenador
from google_auth.models import UsuarioBase

class CoordenadorSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Coordenador'))
    
    class Meta:
        model = Coordenador
        fields = ['id', 'cpf', 'matricula', 'usuario']
    
    def save(self, **kwargs):
        formCoordenador = super().save(**kwargs)

        formCoordenador.full_clean()
        formCoordenador.save()
        return formCoordenador
