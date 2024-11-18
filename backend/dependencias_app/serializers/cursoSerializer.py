from rest_framework import serializers
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from dependencias_app.models.disciplina import Disciplina
from google_auth.models import UsuarioBase
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer

class CursoSerializer(serializers.ModelSerializer):
    turmas = TurmaSerializer(many=True, read_only=True)  # Removido read_only=True
    disciplinas = DisciplinaSerializer(many=True, read_only=True)  # Removido read_only=True
    coordenador = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Coordenador'))  # Representação completa do coordenador

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

        # Representação completa do coordenador
        if hasattr(instance, 'coordenador'):
            representation['coordenador'] = UsuarioBaseSerializer(instance.coordenador).data

        # Adiciona dados das turmas
        if hasattr(instance, 'turmas'):
            representation['turmas'] = TurmaSerializer(instance.turmas.all(), many=True).data

        # Adiciona dados das disciplinas
        if hasattr(instance, 'disciplinas'):
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
        """
        Atualiza os campos simples do curso, além das turmas e disciplinas associadas.
        """
        # Atualizar campos simples do curso
        instance.nome = validated_data.get('nome', instance.nome)
        instance.modalidade = validated_data.get('modalidade', instance.modalidade)
        instance.carga_horaria = validated_data.get('carga_horaria', instance.carga_horaria)
        instance.coordenador = validated_data.get('coordenador', instance.coordenador)
        instance.save()

        # Atualizar turmas e disciplinas
        self._update_turmas(instance, validated_data.get('turmas', []))
        self._update_disciplinas(instance, validated_data.get('disciplinas', []))

        return instance

    def _update_turmas(self, instance, turmas_data):
        """
        Atualiza ou cria turmas para o curso.
        """
        turma_ids = []
        for turma_data in turmas_data:
            turma_data = turma_data.copy()  # Faz uma cópia para evitar modificar o dicionário original

            # Adiciona a referência ao curso
            if 'curso' not in turma_data:
                turma_data['curso'] = instance  # Garante que o campo 'curso' esteja presente

            turma_id = turma_data.get('id')
            if turma_id:
                # Se a turma já existe, atualiza
                turma = Turma.objects.filter(id=turma_id, curso=instance).first()
                if turma:
                    turma.numero = turma_data.get('numero', turma.numero)
                    turma.save()
                    turma_ids.append(turma.id)
            else:
                # Se a turma não existe, cria uma nova turma associada ao curso
                new_turma = Turma.objects.create(**turma_data)
                turma_ids.append(new_turma.id)

        # Remover turmas que não foram enviadas
        Turma.objects.filter(curso=instance).exclude(id__in=turma_ids).delete()

    def _update_disciplinas(self, instance, disciplinas_data):
        """
        Atualiza ou cria disciplinas para o curso.
        """
        disciplina_ids = []
        for disciplina_data in disciplinas_data:
            disciplina_data = disciplina_data.copy()  # Faz uma cópia para evitar modificar o dicionário original

            # Adiciona a referência ao curso
            if 'curso' not in disciplina_data:
                disciplina_data['curso'] = instance  # Garante que o campo 'curso' esteja presente

            disciplina_id = disciplina_data.get('id')
            if disciplina_id:
                # Se a disciplina já existe, atualiza
                disciplina = Disciplina.objects.filter(id=disciplina_id, curso=instance).first()
                if disciplina:
                    disciplina.nome = disciplina_data.get('nome', disciplina.nome)
                    disciplina.save()
                    disciplina_ids.append(disciplina.id)
            else:
                # Se a disciplina não existe, cria uma nova disciplina associada ao curso
                new_disciplina = Disciplina.objects.create(**disciplina_data)
                disciplina_ids.append(new_disciplina.id)

        # Remover disciplinas que não foram enviadas
        Disciplina.objects.filter(curso=instance).exclude(id__in=disciplina_ids).delete()




