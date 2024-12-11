from rest_framework import serializers
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from google_auth.models import UsuarioBase
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer

class CursoSerializer(serializers.ModelSerializer):
    turmas = TurmaSerializer(many=True, read_only=True)
    disciplinas = DisciplinaSerializer(many=True, read_only=True)
    coordenador = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Coordenador')) 

    class Meta:
        model = Curso
        fields = '__all__'

    def save(self, **kwargs):
        formCurso = super().save(**kwargs)
        formCurso.full_clean()
        formCurso.save()
        return formCurso

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
                # Aqui, você usa o Serializador de Turma para representar as turmas corretamente
                representation['turmas'] = TurmaSerializer(instance.turmas.all(), many=True).data
            if hasattr(instance, 'disciplinas'):
                # Serializa as disciplinas também
                representation['disciplinas'] = DisciplinaSerializer(instance.disciplinas.all().order_by('nome'), many=True).data

        return representation

    def validate_coordenador(self, value):
        """
        Valida se o coordenador já está associado a outro curso.
        """
        curso_existente = Curso.objects.filter(coordenador=value).exclude(
            id=self.instance.id if self.instance else None
        ).first()
        if curso_existente:
            raise serializers.ValidationError(
                f"O coordenador '{value.nome}' já está associado ao curso '{curso_existente.nome}'."
            )
        return value     

    def update(self, instance, validated_data):
        print(validated_data)
        turmas_data = validated_data.pop('turmas', [])  # Pega as turmas associadas

        # Atualiza os campos do curso
        instance.nome = validated_data.get('nome', instance.nome)
        instance.modalidade = validated_data.get('modalidade', instance.modalidade)
        instance.carga_horaria = validated_data.get('carga_horaria', instance.carga_horaria)
        instance.coordenador = validated_data.get('coordenador', instance.coordenador)
        instance.save()

        # Agora lidamos com as turmas associadas
        for turma_data in turmas_data:
            turma_id = turma_data.get('id', None)

            if turma_id:
                # Se a turma já existe, atualize-a
                try:
                    turma = Turma.objects.get(id=turma_id, curso=instance)
                    turma.numero = turma_data.get('numero', turma.numero)
                    turma.save()
                except Turma.DoesNotExist:
                    raise serializers.ValidationError(f"Turma com id {turma_id} não encontrada ou não associada ao curso.")
            else:
                # Se a turma não tem id, cria uma nova
                turma_data['curso'] = instance
                Turma.objects.create(**turma_data)

        return instance







