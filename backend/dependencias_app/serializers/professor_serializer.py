from rest_framework import serializers
from dependencias_app.models.professor import Professor
from google_auth.models import Usuario
import re

class ProfessorSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.filter(grupo__name='Professor'))
    
    class Meta:
        model = Professor
        fields = ['id', 'cpf', 'matricula', 'usuario']
    
    def save(self, **kwargs):
        formProfessor = super().save(**kwargs)

        formProfessor.full_clean()
        formProfessor.save()
        return formProfessor

    def validate_cpf(self, cpf):
        cpf = re.sub(r'[^0-9]', '', cpf)
        
        if len(cpf) != 11 or cpf in (str(i) * 11 for i in range(10)):  
            raise serializers.ValidationError("CPF inválido.")

        def calcula_digito(cpf, peso):
            soma = sum(int(cpf[i]) * peso[i] for i in range(len(peso)))
            resto = (soma * 10) % 11
            return str(resto if resto < 10 else 0)

        if calcula_digito(cpf, range(10, 1, -1)) != cpf[9] or calcula_digito(cpf, range(11, 1, -1)) != cpf[10]:
            raise serializers.ValidationError("CPF inválido.")

        return cpf

    def validate_matricula(self, matricula):
        if not matricula.isdigit():
            raise serializers.ValidationError("A matrícula deve conter apenas números.")
        if len(matricula) != 7:
            raise serializers.ValidationError("A matrícula SIAPE deve ter exatamente 7 dígitos.")
        return matricula

