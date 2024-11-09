from rest_framework import serializers
from dependencias_app.models.professor import Professor
from google_auth.models import UsuarioBase

class ProfessorSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    
    class Meta:
        model = Professor
        fields = ['id', 'cpf', 'matricula', 'usuario']
    
    def save(self, **kwargs):
        formProfessor = super().save(**kwargs)

        formProfessor.full_clean()
        formProfessor.save()
        return formProfessor
