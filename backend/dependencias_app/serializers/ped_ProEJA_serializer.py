from rest_framework import serializers
from google_auth.models import Usuario
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.ped_ProEJA import PED_ProEJA
from dependencias_app.models.calendario_academico import Calendario_Academico
from dependencias_app.models.notificacao import Notificacao
from django.conf import settings


class PED_ProEJA_Serializer(serializers.ModelSerializer):
    # variáveis de entrada do serializer (POST), recebe as chaves primárias para vincular as tabelas
    aluno = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.filter(grupo__name='Aluno'))
    professor_disciplina = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.filter(grupo__name='Professor'))
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.filter(modalidade='ProEJA'))
    periodo_letivo = serializers.PrimaryKeyRelatedField(queryset=Calendario_Academico.objects.filter(tipo_calendario='ProEJA'))
    disciplina = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())

    class Meta:
        model = PED_ProEJA
        fields = '__all__'
    
    def validate(self, attrs):
        validated_data = super().validate(attrs)

        curso = validated_data.get('curso', None)
        disciplina = validated_data.get('disciplina', None)
        aluno = validated_data.get('aluno', None)

        if aluno:

            peds_emi = aluno.peds_emi.exclude(status='Desativada')
            peds_proeja = aluno.peds_proeja.exclude(status='Desativada')

            if peds_emi.exists():
                raise serializers.ValidationError({"aluno": "Este aluno possui progressões ativas na modalidade EMI"})
            elif peds_proeja.exists() and len(peds_proeja) == 2:
                raise serializers.ValidationError({"aluno": "O aluno alcançou o número máximo de progressões ativas"})

        if not disciplina.cursos.filter(id=curso.id).exists(): raise serializers.ValidationError("Disciplina não vinculada ao curso da PED")

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

        professor_ped = instance.professores_proeja.filter(responsavel_atual=True).first()

        if retorno == 'lista':
            # Inclui apenas os campos `id` e os campos configurados manualmente
            representation = {
                'id': instance.id,
                'aluno': str(instance.aluno),
                'professor_disciplina': str(instance.professor_disciplina),
                'professor_ped': str(professor_ped.professor),
                'curso': str(instance.curso),
                'disciplina': str(instance.disciplina),
                'status': instance.status
            }
        
        elif retorno == 'edicao':
            representation = {
                'ids': {
                    'aluno': instance.aluno.id,
                    'professor_ped': professor_ped.professor.id,
                    'professor_disciplina': instance.professor_disciplina.id,
                    'curso': instance.curso.id,
                    'disciplina': instance.disciplina.id,
                    'trimestre_recuperar': instance.trimestre_recuperar,
                    'serie_progressao': instance.serie_progressao,
                    'periodo_letivo': instance.periodo_letivo.id,
                    'turma_atual': instance.turma_atual.id
                },
                'valores': {
                    'aluno': str(instance.aluno),
                    'professor_ped': str(professor_ped.professor),
                    'professor_disciplina': str(instance.professor_disciplina),
                    'curso': instance.curso.nome,
                    'disciplina': instance.disciplina.nome,
                    'trimestre_recuperar': instance.trimestre_recuperar,
                    'serie_progressao': instance.serie_progressao,
                    'periodo_letivo': instance.periodo_letivo.titulo,
                    'turma_atual': instance.turma_atual.numero
                }
            }

        elif retorno == 'detalhes':
            professores_ped = instance.professores_proeja.all()

            representation = {
                'id': instance.id,
                'aluno': str(instance.aluno),
                'professor_disciplina': str(instance.professor_disciplina),
                'curso': instance.curso.nome,
                'disciplina': instance.disciplina.nome,
                'trimestre_recuperar': instance.trimestre_recuperar,
                'serie_progressao': instance.serie_progressao,
                'periodo_letivo': instance.periodo_letivo.titulo,
                'turma_atual': instance.turma_atual.numero,
                'observacao': instance.observacao,
                'status': instance.status,
                'professores': [
                    {
                        'nome': str(p.professor),
                        'responsavel_atual': p.responsavel_atual
                    } for p in professores_ped
                ]            
            }

        elif retorno == 'aluno':
            representation = {
                'aluno': str(instance.aluno),
                'professor_ped': str(professor_ped.professor),
                'professor_disciplina': str(instance.professor_disciplina),
                'curso': instance.curso.nome,
                'disciplina': instance.disciplina.nome,
                'trimestre_recuperar': instance.trimestre_recuperar,
                'serie_progressao': instance.serie_progressao,
                'periodo_letivo': instance.periodo_letivo.titulo,
                'turma_atual': instance.turma_atual.numero,
                'status': instance.status
            }

            plano_estudos = getattr(instance, 'plano_estudos_proeja', None)

            if plano_estudos:
                representation['plano_estudos'] = {
                    'aprovado': plano_estudos.aprovado
                }

        return representation
    

