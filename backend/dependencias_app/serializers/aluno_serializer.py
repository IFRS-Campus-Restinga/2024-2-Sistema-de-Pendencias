from rest_framework import serializers
from dependencias_app.models.aluno import Aluno
from datetime import date, datetime
import re

class Aluno_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = ['id', 'cpf', 'data_nascimento', 'matricula', 'telefone', 'usuario']

    def validate_cpf(self, cpf):
        cpf = re.sub(r'[^0-9]', '', cpf)  # Remove caracteres não numéricos
        
        if len(cpf) != 11 or cpf in (str(i) * 11 for i in range(10)):  
            raise serializers.ValidationError("CPF inválido.")

        # Validação matemática do CPF
        def calcula_digito(cpf, peso):
            soma = sum(int(cpf[i]) * peso[i] for i in range(len(peso)))
            resto = (soma * 10) % 11
            return str(resto if resto < 10 else 0)

        if calcula_digito(cpf, range(10, 1, -1)) != cpf[9] or calcula_digito(cpf, range(11, 1, -1)) != cpf[10]:
            raise serializers.ValidationError("CPF inválido.")

        return cpf

    def validate_data_nascimento(self, data_nascimento):
        hoje = date.today()
        idade = hoje.year - data_nascimento.year - ((hoje.month, hoje.day) < (data_nascimento.month, data_nascimento.day))
        
        if idade < 14:
            raise serializers.ValidationError("O aluno deve ter pelo menos 14 anos.")
        
        return data_nascimento

    def validate_telefone(self, telefone):
        telefone = re.sub(r'[^0-9]', '', telefone)
        
        if not re.match(r'^(?:[1-9]{2})?(?:9[0-9]{8})$', telefone):
            raise serializers.ValidationError("Telefone inválido. Use o formato DDD + número (ex: 11987654321).")
        
        return telefone

    def validate(self, data):
        usuario = data.get("usuario")
        matricula = data.get("matricula")

        if usuario and matricula:
            email_usuario = usuario.email
            parte_email = email_usuario.split("@")[0]

            if parte_email != matricula:
                raise serializers.ValidationError({"matricula": "A matrícula deve ser igual à parte antes do '@' no e-mail."})

        return data
