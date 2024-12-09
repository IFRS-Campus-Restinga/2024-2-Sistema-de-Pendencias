from rest_framework import serializers
from google_auth.models import UsuarioBase
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.models.calendarioAcademico import CalendarioAcademico
from dependencias_app.models.notificacao import Notificacao


class PED_ProEJA_Serializer(serializers.ModelSerializer):
    # variáveis de entrada do serializer (POST), recebe as chaves primárias para vincular as tabelas
    aluno = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    professor_disciplina = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    professor_ped = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.filter(modalidade='ProEJA'))
    periodo_letivo = serializers.PrimaryKeyRelatedField(queryset=CalendarioAcademico.objects.filter(tipo_calendario='ProEJA'))
    disciplina = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())

    class Meta:
        model = PED_ProEJA
        fields = '__all__'

    def save(self, **kwargs):
        formPED_ProEJA = super().save(**kwargs)

        formPED_ProEJA.full_clean()
        formPED_ProEJA.save()

       # cria notificação para o aluno
        Notificacao.objects.create(usuario=formPED_ProEJA.aluno, mensagem='Nova PED (Integrado) cadastrada', url=f'Integrado/{formPED_ProEJA.id}/detalhes')

        # cria notificação para o professor responsável
        Notificacao.objects.create(usuario=formPED_ProEJA.professor_ped, mensagem='Você foi registrado como professor responsável por uma PED (Integrado)', url=f'peds-proeja/{formPED_ProEJA.id}')
        
        return formPED_ProEJA
    
    def validate(self, attrs):
        validated_data = super().validate(attrs)

        curso = validated_data.get('curso', None)
        disciplina = validated_data.get('disciplina', None)

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

        if retorno == 'lista':
            # Inclui apenas os campos `id` e os campos configurados manualmente
            representation = {
                'id': instance.id,
                'aluno': str(instance.aluno),
                'professor_disciplina': str(instance.professor_disciplina),
                'professor_ped': str(instance.professor_ped),
                'curso': str(instance.curso),
                'disciplina': str(instance.disciplina),
                'status': instance.status
            }
        
        elif retorno == 'detalhes':
            representation['aluno'] = {'id': instance.aluno.id, 'nome': str(instance.aluno)}
            representation['professor_disciplina'] = {'id': instance.professor_disciplina.id, 'nome': str(instance.professor_disciplina)}
            representation['professor_ped'] = {'id': instance.professor_ped.id, 'nome': str(instance.professor_ped)}
            representation['curso'] = {'id': instance.curso.id, 'nome': instance.curso.nome}
            representation['disciplina'] = {'id': instance.disciplina.id, 'nome': instance.disciplina.nome}
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
            representation['periodo_letivo'] = instance.periodo_letivo.data_inicio

            representation.pop('data_criacao')
            representation.pop('plano_estudos')
            representation.pop('form_encerramento')

        return representation