from rest_framework import serializers
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from dependencias_app.models.disciplina import Disciplina
from google_auth.models import UsuarioBase
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer
from django.db import IntegrityError

class CursoSerializer(serializers.ModelSerializer):
    turmas = TurmaSerializer(many=True, required=False)
    disciplinas = DisciplinaSerializer(many=True, required=False)
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

        if hasattr(instance, 'coordenador'):
            representation['coordenador'] = UsuarioBaseSerializer(instance.coordenador).data

        if hasattr(instance, 'turmas'):
            representation['turmas'] = TurmaSerializer(instance.turmas.all(), many=True).data

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

    # def create(self, validated_data):
    #     """
    #     Cria um curso e as turmas associadas.
    #     """
    #     turmas_data = validated_data.pop('turmas', [])
    #     curso = Curso.objects.create(**validated_data)

    #     # Criar as turmas associadas ao curso
    #     for turma_data in turmas_data:
    #         turma_data['curso'] = curso  # Garantir que a turma será associada ao curso
    #         Turma.objects.create(**turma_data)

    #     return curso

    def create(self, validated_data):
        """
        Cria um curso e as turmas associadas.
        Se a turma já existir (baseado no id), atualiza seu número.
        Se não, cria uma nova turma.
        """
        turmas_data = validated_data.pop('turmas', [])
        curso = Curso.objects.create(**validated_data)

        # Para cada turma, verifica se ela já existe e atualiza o número, ou cria uma nova turma
        for turma_data in turmas_data:
            turma_id = turma_data.get('id', None)  # Verifica se há o 'id' da turma

            if turma_id:
                # Se o id da turma existir, tenta buscar essa turma no banco
                try:
                    turma = Turma.objects.get(id=turma_id, curso=curso)  # Busca a turma existente para esse curso
                    turma.numero = turma_data.get('numero', turma.numero)  # Atualiza o número da turma
                    turma.save()  # Salva a turma
                except Turma.DoesNotExist:
                    raise serializers.ValidationError(f"Turma com id {turma_id} não encontrada ou não associada ao curso.")
            else:
                # Caso o id não exista, cria uma nova turma associada ao curso
                turma_data['curso'] = curso
                Turma.objects.create(**turma_data)

        return curso
    
    # def update(self, instance, validated_data):
    #     """
    #     Atualiza o curso e as turmas associadas.
    #     """
    #     turmas_data = validated_data.pop('turmas', [])

    #     # Atualiza os campos do curso
    #     instance.nome = validated_data.get('nome', instance.nome)
    #     instance.modalidade = validated_data.get('modalidade', instance.modalidade)
    #     instance.carga_horaria = validated_data.get('carga_horaria', instance.carga_horaria)
    #     instance.coordenador = validated_data.get('coordenador', instance.coordenador)
    #     instance.save()

    #     # Excluir turmas associadas de forma controlada
    #     for turma in instance.turmas.all():
    #         try:
    #             turma.delete()  # Deleta a turma uma a uma
    #         except IntegrityError:
    #             pass  # Tratar exceção ou logar o erro conforme necessário

    #     # Atualiza ou cria novas turmas associadas
    #     for turma_data in turmas_data:
    #         turma_id = turma_data.get('id', None)

    #         if turma_id:
    #             try:
    #                 turma = Turma.objects.get(id=turma_id, curso=instance)
    #                 turma.numero = turma_data.get('numero', turma.numero)
    #                 turma.save()
    #             except Turma.DoesNotExist:
    #                 raise serializers.ValidationError(f"Turma com id {turma_id} não encontrada ou não associada ao curso.")
    #         else:
    #             turma_data['curso'] = instance
    #             Turma.objects.create(**turma_data)

    #     return instance


    def update(self, instance, validated_data):
        """
        Atualiza o curso e as turmas associadas.
        """
        # Print para ver o que chegou no validated_data
        print("Validated Data:", validated_data)

        turmas_data = validated_data.pop('turmas', [])

        # Print para ver a instância do curso
        print("Instance before update:", instance)

        # Atualiza os campos do curso
        instance.nome = validated_data.get('nome', instance.nome)
        instance.modalidade = validated_data.get('modalidade', instance.modalidade)
        instance.carga_horaria = validated_data.get('carga_horaria', instance.carga_horaria)
        instance.coordenador = validated_data.get('coordenador', instance.coordenador)
        instance.save()

        # Excluir turmas associadas de forma controlada
        for turma in instance.turmas.all():
            try:
                turma.delete()  # Deleta a turma uma a uma
            except IntegrityError:
                pass  # Tratar exceção ou logar o erro conforme necessário

        # Atualiza ou cria novas turmas associadas
        for turma_data in turmas_data:
            turma_id = turma_data.get('id', None)

            # Print para verificar os dados das turmas
            print("Turma Data:", turma_data)

            if turma_id:
                try:
                    turma = Turma.objects.get(id=turma_id, curso=instance)
                    turma.numero = turma_data.get('numero', turma.numero)
                    turma.save()
                except Turma.DoesNotExist:
                    raise serializers.ValidationError(f"Turma com id {turma_id} não encontrada ou não associada ao curso.")
            else:
                turma_data['curso'] = instance
                Turma.objects.create(**turma_data)

        # Print para ver o estado final da instância
        print("Instance after update:", instance)

        return instance






