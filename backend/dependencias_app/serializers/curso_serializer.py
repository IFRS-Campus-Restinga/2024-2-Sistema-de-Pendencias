from rest_framework import serializers
from dependencias_app.models.curso import Curso
from google_auth.models import Usuario
from dependencias_app.serializers.disciplina_serializer import Disciplina_Serializer
from dependencias_app.serializers.turma_serializer import Turma_Serializer

class Curso_Serializer(serializers.ModelSerializer):
    turmas = Turma_Serializer(many=True, read_only=True)
    disciplinas = Disciplina_Serializer(many=True, read_only=True)
    coordenador = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.filter(grupo__name='Coordenador')) 

    class Meta:
        model = Curso
        fields = '__all__'
    
    def validate(self, data):
        coordenador = data.get('coordenador')

        if coordenador:
            curso_existente = Curso.objects.filter(coordenador=coordenador)

            if self.instance:
                curso_existente = curso_existente.exclude(id=self.instance.id)

            if curso_existente.exists():
                raise serializers.ValidationError({
                    'coordenador': 'Este coordenador já está vinculado a outro curso.'
                })

        return data

    def validate_nome(self, value):
        nome = value.strip()

        if len(nome) < 3:
            raise serializers.ValidationError("O nome do curso deve ter pelo menos 3 caracteres.")

        if len(nome) > 30:
            raise serializers.ValidationError("O nome do curso deve ter no máximo 30 caracteres.")

        if not nome:
            raise serializers.ValidationError("O nome do curso não pode estar vazio ou conter apenas espaços.")

        return nome

    def validate_carga_horaria(self, value):
        if int(value) <= 0:
            raise serializers.ValidationError("A carga horária deve ser maior que 0.")

        return value
    
    def validate_coordenador(self, value):
        if value == '' or not value:
            raise serializers.ValidationError('O curso deve possuir um coordenador')
        
        return value

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'lista':
            if hasattr(instance, 'coordenador'):
                representation['coordenador'] = str(instance.coordenador)

            representation.pop('turmas')
            representation.pop('disciplinas')

        elif retorno == 'dependencia':
            if hasattr(instance, 'turmas'):
                representation['turmas'] = Turma_Serializer(instance.turmas.all(), many=True).data
            if hasattr(instance, 'disciplinas'):
                representation['disciplinas'] = Disciplina_Serializer(instance.disciplinas.all().order_by('nome'), many=True).data
            
            representation.pop('coordenador')

        elif retorno == 'detalhes':
            representation['coordenador'] = {"id": instance.coordenador.id, "email": instance.coordenador.email}
            representation['turmas'] = Turma_Serializer(instance.turmas.all(), many=True).data

        elif retorno == 'disciplina':
            representation = {"id": instance.id, "nome": instance.nome}


        return representation
