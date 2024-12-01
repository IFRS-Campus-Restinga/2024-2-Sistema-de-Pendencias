from rest_framework import serializers
from google_auth.models import UsuarioBase
from django.contrib.auth.models import Group

class UsuarioBaseSerializer(serializers.ModelSerializer):
    grupo = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())
    matricula = serializers.SerializerMethodField()
    cpf = serializers.SerializerMethodField()
    data_nascimento = serializers.SerializerMethodField()
    telefone = serializers.SerializerMethodField()

    class Meta:
        model = UsuarioBase
        fields = ['id', 'nome', 'email', 'data_ingresso', 'primeiro_login', 'grupo', 'is_active', 'matricula', 'cpf', 'data_nascimento', 'telefone']

    def save(self, **kwargs):
        formUsuarioBase = super().save(**kwargs)

        formUsuarioBase.full_clean()
        formUsuarioBase.save()
        return formUsuarioBase
    
    def get_cpf(self, obj):
        if obj.grupo and obj.grupo.name == 'Professor' and obj.grupo.name == 'Coordenador' and hasattr(obj, 'professor' or 'coordenador'):
            return obj.professor.cpf or obj.coordenador.cpf
        elif obj.grupo and obj.grupo.name == 'Aluno' and hasattr(obj, 'aluno'):
            return obj.aluno.cpf
        return None

    def get_matricula(self, obj):
        if obj.grupo and obj.grupo.name == 'Professor' and obj.grupo.name == 'Coordenador' and hasattr(obj, 'professor' or 'coordenador'):
            return obj.professor.matricula or obj.coordenador.matricula
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

        if retorno == 'listar':
            fields_to_check = ['cpf', 'matricula', 'data_nascimento', 'telefone']

            for field in fields_to_check:
                if representation.get(field) is None:
                    representation.pop(field)
            
            representation.pop('primeiro_login')
            representation.pop('is_active')

            if instance.is_active:
                representation['ativo'] = 'Ativo'
            else:
                representation['ativo'] = 'Inativo'

        
        representation['grupo'] = instance.grupo.name if instance.grupo else None

        return representation