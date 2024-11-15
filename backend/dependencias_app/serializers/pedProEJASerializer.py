from rest_framework import serializers
from google_auth.models import UsuarioBase
from dependencias_app.enums.modalidade import Modalidade
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.planoEstudosSerializer import PlanoEstudos_Serializer
from dependencias_app.serializers.formEncerramentoSerializer import FormEncerramentoSerializer

class PED_ProEJA_Serializer(serializers.ModelSerializer):
    aluno = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    professor_ped = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    professor_disciplina = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    disciplina = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.filter(modalidade='ProEJA'))
    plano_estudos = PlanoEstudos_Serializer(read_only=True)
    form_encerramento = FormEncerramentoSerializer(read_only=True)

    class Meta:
        model = PED_ProEJA
        fields = '__all__'

    def save(self, **kwargs):
        formPED_EMI = super().save(**kwargs)

        formPED_EMI.full_clean()
        formPED_EMI.save()
        return formPED_EMI
    
    def validate(self, data):
        curso = data.get('curso')
        disciplina = data.get('disciplina')

        if not disciplina.cursos.filter(id=curso.id).exists():
            raise serializers.ValidationError('A disciplina informada não pertence ao curso informado')
        
        return data
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # consultar dados do aluno
        if hasattr(instance, 'aluno'):
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data
        
        # consulta dados do professore
        if hasattr(instance, 'professor_disciplina'):
            representation['professor_disciplina'] = UsuarioBaseSerializer(instance.professor_disciplina).data

        if hasattr(instance, 'professor_ped'):
            representation['professor_ped'] = UsuarioBaseSerializer(instance.professor_ped).data
        
        # consulta dados do curso
        if hasattr(instance, 'curso'):
            representation['curso'] = CursoSerializer(instance.curso).data
        
        # consulta dados da disciplina
        if hasattr(instance, 'disciplina'):
            representation['disciplina'] = DisciplinaSerializer(instance.disciplina).data

        if hasattr(instance, 'plano_estudos'):
            representation['plano_estudos'] = PlanoEstudos_Serializer(instance.plano_estudos).data
        else:
            representation['plano_estudos'] = {}
        
        if hasattr(instance, 'form_encerramento'):
            representation['form_encerramento'] = FormEncerramentoSerializer(instance.form_encerramento).data
        else:
            representation['form_encerramento'] = {}
        
        # retorna os dados em vez de apenas os id's que fazem o vinculo entre cada instância da PED
        return representation


