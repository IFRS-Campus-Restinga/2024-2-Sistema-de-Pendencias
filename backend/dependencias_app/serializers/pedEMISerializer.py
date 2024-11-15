from rest_framework import serializers
from google_auth.models import UsuarioBase
from dependencias_app.enums.modalidade import Modalidade
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.turma import Turma
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.planoEstudosSerializer import PlanoEstudos_Serializer
from dependencias_app.serializers.formEncerramentoSerializer import FormEncerramentoSerializer

class PED_EMI_Serializer(serializers.ModelSerializer):
    # variáveis de entrada do serializer (POST), recebe as chaves primárias para vincular as tabelas
    aluno = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    professor_disciplina = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    professor_ped = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.filter(modalidade='Integrado'))
    disciplina = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())
    turma_origem = serializers.PrimaryKeyRelatedField(queryset=Turma.objects.all())
    plano_estudos = PlanoEstudos_Serializer(read_only=True)
    form_encerramento = FormEncerramentoSerializer(read_only=True)

    # variáveis de saída do serializer (GET), retorna um dado por tabela vinculada
    aluno = serializers.SerializerMethodField()
    professor_disciplina = serializers.SerializerMethodField()
    professor_ped = serializers.SerializerMethodField()
    curso = serializers.SerializerMethodField()
    disciplina = serializers.SerializerMethodField()
    turma_origem = serializers.SerializerMethodField()
    plano_estudos = PlanoEstudos_Serializer(read_only=True)
    form_encerramento = FormEncerramentoSerializer(read_only=True)

    class Meta:
        model = PED_EMI
        fields = '__all__'

    def save(self, **kwargs):
        formPED_EMI = super().save(**kwargs)

        formPED_EMI.full_clean()
        formPED_EMI.save()
        return formPED_EMI
    
    def get_aluno(self, obj):
        if obj.aluno and hasattr(obj, 'aluno'):
            return obj.aluno.nome or obj.aluno.email[:10]
        return None
    
    def get_professor_ped(self, obj):
        if obj.professor_ped and hasattr(obj, 'professor_ped'):
            return obj.professor_ped.nome or obj.professor_ped.email
        return None
    
    def get_professor_disciplina(self, obj):
        if obj.professor_disciplina and hasattr(obj, 'professor_disciplina'):
            return obj.professor_disciplina.nome or obj.professor_disciplina.email
        return None
    
    def get_curso(self, obj):
        if obj.curso and hasattr(obj, 'curso'):
            return obj.curso.nome
        return None
    
    def get_disciplina(self, obj):
        if obj.disciplina and hasattr(obj, 'disciplina'):
            return obj.disciplina.nome
        return None
    
    def get_turma_origem(self, obj):
        if obj.turma_origem and hasattr(obj, 'turma_origem'):
            return obj.turma_origem.numero
        return None
    
    def validate(self, data):
        curso = data.get('curso')
        disciplina = data.get('disciplina')
        serie_progressao = data.get('serie_progressao')
        turma_origem = data.get('turma_origem')

        if not disciplina.cursos.filter(id=curso.id).exists():
            raise serializers.ValidationError('A disciplina informada não pertence ao curso informado')
        
        if int(turma_origem.numero[0]) <= int(serie_progressao[0]):
            raise serializers.ValidationError('A série de progressão não pode ser inferior a turma de origem')
        
        return data