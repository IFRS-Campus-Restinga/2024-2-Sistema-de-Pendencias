from rest_framework import serializers
from google_auth.models import UsuarioBase
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.turma import Turma
from dependencias_app.models.ppt import PPT

class PPTSerializer(serializers.ModelSerializer):
    # variáveis de entrada do serializer (POST), recebe as chaves primárias das tabelas que se relacionam com ppt
    aluno_id = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    professor_ppt_id = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    professor_disciplina_id = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    curso_id = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.filter(modalidade='Integrado'))
    disciplina_id = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())
    turma_origem_id = serializers.PrimaryKeyRelatedField(queryset=Turma.objects.all())
    turma_progressao_id = serializers.PrimaryKeyRelatedField(queryset=Turma.objects.all())

    # variáveis de saída do serializer (GET), retorna um dado por tabela vinculada a ppt (nome/email, numero da turma etc)
    aluno = serializers.SerializerMethodField()
    professor_ppt = serializers.SerializerMethodField()
    professor_disciplina = serializers.SerializerMethodField()
    curso = serializers.SerializerMethodField()
    disciplina = serializers.SerializerMethodField()
    turma_origem = serializers.SerializerMethodField()
    turma_progressao = serializers.SerializerMethodField()

    class Meta:
        model = PPT
        fields = '__all__'
    
    def create(self, validated_data):
        # Criamos a instância do PPT, agora usando as relações corretamente
        ppt_instance = PPT.objects.create(
            aluno=validated_data.pop('aluno_id', None),
            professor_ppt=validated_data.pop('professor_ppt_id', None),
            professor_disciplina=validated_data.pop('professor_disciplina_id', None),
            curso=validated_data.pop('curso_id', None),
            disciplina=validated_data.pop('disciplina_id', None),
            turma_origem=validated_data.pop('turma_origem_id', None),
            turma_progressao=validated_data.pop('turma_progressao_id', None),
            **validated_data  # Preenche os outros campos do modelo
        )
        
        return ppt_instance

    def validate(self, data):
        curso = data.get('curso_id')
        disciplina = data.get('disciplina_id')
        turma_origem = data.get('turma_origem_id')
        turma_progressao = data.get('turma_progressao_id')

        # Verifica se a disciplina está vinculada ao curso
        if not disciplina.cursos.filter(id=curso.id).exists():
            raise serializers.ValidationError("A disciplina não está vinculada ao curso fornecido.")
        
        # Verifica se as turmas pertencem ao curso
        if turma_origem.curso.id != curso.id:
            raise serializers.ValidationError("A turma de origem não está vinculada ao curso fornecido.")
        
        if turma_progressao.curso.id != curso.id:
            raise serializers.ValidationError("A turma de progressão não está vinculada ao curso fornecido.")
        
        # Verifica se a turma de origem não é inferior à de progressão
        if int(turma_origem.numero) < int(turma_progressao.numero):
            raise serializers.ValidationError("A turma de origem não pode ser inferior à turma de progressão.")
        
        return data
    
    def get_aluno(self, obj):
        return obj.aluno.nome or obj.aluno.email[:10] if obj.aluno else None
    
    def get_professor_ppt(self, obj):
        return obj.professor_ppt.nome or obj.professor_ppt.email if obj.professor_ppt else None
    
    def get_professor_disciplina(self, obj):
        return obj.professor_disciplina.nome or obj.professor_disciplina.email if obj.professor_disciplina else None
    
    def get_curso(self, obj):
        return obj.curso.nome if obj.curso else None
    
    def get_disciplina(self, obj):
        return obj.disciplina.nome if obj.disciplina else None
    
    def get_turma_origem(self, obj):
        return obj.turma_origem.numero if obj.turma_origem else None
    
    def get_turma_progressao(self, obj):
        return obj.turma_progressao.numero if obj.turma_progressao else None

    def to_representation(self, instance):
        # Retorna os dados relacionados diretamente, ao invés de IDs
        representation = super().to_representation(instance)

        for field in ['aluno_id', 'professor_ppt_id', 'professor_disciplina_id', 'curso_id', 'disciplina_id', 'turma_origem_id', 'turma_progressao_id']:
            representation.pop(field, None)
            
        return representation
