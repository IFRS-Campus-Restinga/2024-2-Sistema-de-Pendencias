from rest_framework import serializers
from google_auth.models import UsuarioBase
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.planoEstudosSerializer import PlanoEstudos_Serializer
from dependencias_app.serializers.formEncerramentoSerializer import FormEncerramentoSerializer

class PED_ProEJA_Serializer(serializers.ModelSerializer):
    # variáveis de entrada do serializer (POST), recebe as chaves primárias para vincular as tabelas
    aluno_id = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    professor_ped_id = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    professor_disciplina_id = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    curso_id = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.filter(modalidade='ProEJA'))
    disciplina_id = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.none())
    plano_estudos = PlanoEstudos_Serializer(read_only=True)
    form_encerramento = FormEncerramentoSerializer(read_only=True)

    # variáveis de saída do serializer (GET), retorna um valor por tabela vinculada (nome/email, numero da turma, etc)
    aluno = serializers.SerializerMethodField()
    professor_ped = serializers.SerializerMethodField()
    professor_disciplina = serializers.SerializerMethodField()
    disciplina = serializers.SerializerMethodField()
    curso = serializers.SerializerMethodField()
    plano_estudos = PlanoEstudos_Serializer(read_only=True)
    form_encerramento = FormEncerramentoSerializer(read_only=True)

    class Meta:
        model = PED_ProEJA
        fields = '__all__'
    
    def create(self, validated_data):
        aluno = validated_data.pop('aluno_id', None)
        professor_ppt = validated_data.pop('professor_ppt_id', None)
        professor_disciplina = validated_data.pop('professor_disciplina_id', None)
        curso = validated_data.pop('curso_id', None)
        disciplina = validated_data.pop('disciplina_id', None)
        turma_origem = validated_data.pop('turma_origem_id', None)
        turma_progressao = validated_data.pop('turma_progressao_id', None)

        ppt_instance = PED_ProEJA.objects.create(
            aluno=aluno,
            professor_ppt=professor_ppt,
            professor_disciplina=professor_disciplina,
            curso=curso,
            disciplina=disciplina,
            turma_origem=turma_origem,
            turma_progressao=turma_progressao,
            **validated_data  # Preenche os outros campos do modelo
        )
        
        return ppt_instance

    
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
