from rest_framework import serializers
from google_auth.models import UsuarioBase
from dependencias_app.enums.modalidade import Modalidade
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.ped import PED
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.planoEstudosEMISerializer import PlanoEstudos_EMISerializer
from dependencias_app.serializers.planoEstudosProEJASerializer import PlanoEstudos_ProEJASerializer
from dependencias_app.serializers.formEncerramentoSerializer import FormEncerramentoSerializer

class PED_Serializer(serializers.ModelSerializer):
    aluno = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    professor = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all())
    disciplina = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())
    plano_estudos_EMI = PlanoEstudos_EMISerializer(read_only=True)
    plano_estudos_ProEJA = PlanoEstudos_ProEJASerializer(read_only=True)
    form_encerramento = FormEncerramentoSerializer(read_only=True)

    class Meta:
        model = PED
        fields = ['id', 'aluno', 'professor', 'curso', 'modalidade', 'dataInicio', 'situacao',  'status', 'disciplina', 'plano_estudos_EMI', 'plano_estudos_ProEJA', 'form_encerramento']
    
    def save(self, **kwargs):
        formPED_EMI = super().save(**kwargs)

        formPED_EMI.full_clean()
        formPED_EMI.save()
        return formPED_EMI
    
    def validate(self, data):
        curso = data.get('curso')
        disciplina = data.get('disciplina')
        modalidade = data.get('modalidade')

        if not modalidade in Modalidade: raise serializers.ValidationError('Modalidade Inválida')

        if not disciplina.cursos.filter(id=curso.id).exists():
            raise serializers.ValidationError('A disciplina informada não pertence ao curso informado')
        
        return data
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # consultar dados do aluno
        if hasattr(instance, 'aluno'):
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data
        
        # consulta dados do professore
        if hasattr(instance, 'professor'):
            representation['professor'] = UsuarioBaseSerializer(instance.professor).data
        
        # consulta dados do curso
        if hasattr(instance, 'curso'):
            representation['curso'] = CursoSerializer(instance.curso).data
        
        # consulta dados da disciplina
        if hasattr(instance, 'disciplina'):
            representation['disciplina'] = DisciplinaSerializer(instance.disciplina).data

        if hasattr(instance, 'modalidade'):
            if representation['modalidade'] == 'Integrado':
                if hasattr(instance, 'plano_estudos_EMI'):
                    representation['plano_estudos_EMI'] = PlanoEstudos_EMISerializer(instance.plano_estudos_EMI).data

                else: representation['plano_estudos_EMI'] = {}
            
            if representation['modalidade'] == 'ProEJA':
                if hasattr(instance, 'plano_estudos_ProEJA'):
                    representation['plano_estudos_ProEJA'] = PlanoEstudos_ProEJASerializer(instance.plano_estudos_ProEJA).data
                else: representation['plano_estudos_ProEJA'] = {}   
        
        if hasattr(instance, 'form_encerramento'):
            representation['form_encerramento'] = FormEncerramentoSerializer(instance.form_encerramento).data
        else:
            representation['form_encerramento'] = {}

        
        # retorna os dados em vez de apenas os id's que fazem o vinculo entre cada instância da PED
        return representation


