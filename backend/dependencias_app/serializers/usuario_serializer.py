import re
from rest_framework import serializers
from google_auth.models import Usuario
from django.contrib.auth.models import Group

class Usuario_Serializer(serializers.ModelSerializer):
    id = serializers.UUIDField(format='hex_verbose', read_only=True)
    grupo = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())
    matricula = serializers.SerializerMethodField()
    cpf = serializers.SerializerMethodField()
    data_nascimento = serializers.SerializerMethodField()
    telefone = serializers.SerializerMethodField()  

    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'primeiro_login', 'grupo', 'is_active', 'matricula', 'cpf', 'data_nascimento', 'telefone']

    def validate_email(self, value):
        """
        Valida o formato do e-mail caso o grupo do usuário seja 'Aluno'.
        Funciona tanto para criação quanto para edição.
        """
        usuario = self.instance  # Usuário existente (caso seja edição)
        grupo_id = self.initial_data.get('grupo')  # Grupo enviado na requisição

        if grupo_id:
            grupo = Group.objects.filter(id=grupo_id).first()
        else:
            grupo = usuario.grupo if usuario else None

        regex_email = r'^\d{10}@aluno\.restinga\.ifrs\.edu\.br$'

        if grupo and grupo.name == 'Aluno':
            if not re.match(regex_email, value):
                raise serializers.ValidationError("O e-mail deve seguir o formato: 0000000000@aluno.restinga.ifrs.edu.br")

        return value

    def get_cpf(self, obj):
        if obj.grupo and obj.grupo.name == 'Professor' and hasattr(obj, 'professor'):
            return obj.professor.cpf
        elif obj.grupo and obj.grupo.name == 'Aluno' and hasattr(obj, 'aluno'):
            return obj.aluno.cpf
        return None

    def get_matricula(self, obj):
        if obj.grupo and obj.grupo.name == 'Professor' and hasattr(obj, 'professor'):
            return obj.professor.matricula
        elif obj.grupo and obj.grupo.name == 'Aluno' and hasattr(obj, 'aluno'):
            return obj.aluno.matricula
        return None

    def get_data_nascimento(self, obj):
        if obj.grupo and obj.grupo.name == 'Aluno' and hasattr(obj, 'aluno'):
            return obj.aluno.data_nascimento
        return None

    def get_telefone(self, obj):
        if obj.grupo and obj.grupo.name == 'Aluno' and hasattr(obj, 'aluno'):
            return obj.aluno.telefone
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'lista':
            fields_to_check = ['cpf', 'matricula', 'data_nascimento', 'telefone']
            for field in fields_to_check:
                    representation.pop(field)

            representation.pop('primeiro_login')
            representation.pop('is_active')

            representation['ativo'] = 'Ativo' if instance.is_active else 'Inativo'

        representation['grupo'] = instance.grupo.name if instance.grupo else None
        return representation
