from rest_framework import serializers
from google_auth.models import UsuarioBase
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.turma import Turma
from dependencias_app.models.calendarioAcademico import CalendarioAcademico
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer
from dependencias_app.serializers.calendarioAcademicoSerializer import CalendarioAcademicoSerializer
import os
from dependencias_app.utils.enviar_email import enviar_email



class PED_EMI_Serializer(serializers.ModelSerializer):
    # variáveis de entrada do serializer (POST), recebe as chaves primárias para vincular as tabelas
    aluno = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    professor_disciplina = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    professor_ped = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.filter(modalidade='Integrado'))
    disciplina = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())
    periodo_letivo = serializers.PrimaryKeyRelatedField(queryset=CalendarioAcademico.objects.filter(tipo_calendario='Integrado'))
    turma_atual = serializers.PrimaryKeyRelatedField(queryset=Turma.objects.all())

    class Meta:
        model = PED_EMI
        fields = '__all__'

    def save(self, **kwargs):
        formPED_EMI = super().save(**kwargs)

        formPED_EMI.full_clean()
        formPED_EMI.save()
        
        return formPED_EMI
    
    def validate(self, attrs):
        validated_data = super().validate(attrs)

        curso = validated_data.get('curso', None)
        disciplina = validated_data.get('disciplina', None)
        turma_atual = validated_data.get('turma_atual', None)
        serie_progressao = validated_data.get('serie_progressao', None)

        if not disciplina.cursos.filter(id=curso.id).exists(): raise serializers.ValidationError("Disciplina não vinculada ao curso da PED")
        if not turma_atual.curso == curso: raise serializers.ValidationError("Turma atual não vinculada ao curso da PED")
        if int(turma_atual.numero[0]) <= int(serie_progressao[0]): raise serializers.ValidationError("Série de Progressão não pode ser igual ou superior à turma atual")

        return validated_data 
    
    
    def set_disabled(self, ped):
        ped.status = 'Desativado'
        ped.save()

        return ped
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Verifica se a requisição pediu representação detalhada
        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'lista':
            # Inclui apenas os campos `id` e os campos configurados manualmente
            representation = {
                'id': instance.id,
                'aluno': str(instance.aluno),
                'professor_disciplina': str(instance.professor_disciplina),
                'professor_ped': str(instance.professor_ped),
                'curso': str(instance.curso),
                'disciplina': str(instance.disciplina),
                'turma_atual': str(instance.turma_atual),
                'status': instance.status
            }
        
        elif retorno == 'detalhes':
            representation['aluno'] = {'id': instance.aluno.id, 'nome': str(instance.aluno)}
            representation['professor_disciplina'] = {'id': instance.professor_disciplina.id, 'nome': str(instance.professor_disciplina)}
            representation['professor_ped'] = {'id': instance.professor_ped.id, 'nome': str(instance.professor_ped)}
            representation['curso'] = {'id': instance.curso.id, 'nome': instance.curso.nome}
            representation['disciplina'] = {'id': instance.disciplina.id, 'nome': instance.disciplina.nome}
            representation['turma_atual'] = {'id': instance.turma_atual.id, 'numero': instance.turma_atual.numero}
            representation['periodo_letivo'] = {'id': instance.periodo_letivo.id, 'titulo': instance.periodo_letivo.titulo}

            representation.pop('data_criacao')
            representation.pop('plano_estudos')
            representation.pop('form_encerramento')

        elif retorno == 'aluno':
            representation['aluno'] = {'id': instance.aluno.id, 'nome': str(instance.aluno)}
            representation['professor_disciplina'] = {'id': instance.professor_disciplina.id, 'nome': str(instance.professor_disciplina)}
            representation['professor_ped'] = {'id': instance.professor_ped.id, 'nome': str(instance.professor_ped)}
            representation['curso'] = {'id': instance.curso.id, 'nome': instance.curso.nome}
            representation['disciplina'] = {'id': instance.disciplina.id, 'nome': instance.disciplina.nome}
            representation['turma_atual'] = {'id': instance.turma_atual.id, 'numero': instance.turma_atual.numero}
            representation['periodo_letivo'] = instance.periodo_letivo.data_inicio

            representation.pop('data_criacao')
            representation.pop('plano_estudos')
            representation.pop('form_encerramento')


        return representation
