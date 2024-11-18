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
    aluno_id = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    professor_disciplina_id = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    professor_ped_id = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    curso_id = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.filter(modalidade='Integrado'))
    disciplina_id = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())
    turma_origem_id = serializers.PrimaryKeyRelatedField(queryset=Turma.objects.all())
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
    
    def create(self, validated_data):
        ped_instance = PED_EMI.objects.create(
            aluno=validated_data.pop('aluno_id', None),
            professor_ped=validated_data.pop('professor_ped_id', None),
            professor_disciplina=validated_data.pop('professor_disciplina_id', None),
            curso=validated_data.pop('curso_id', None),
            disciplina=validated_data.pop('disciplina_id', None),
            turma_origem=validated_data.pop('turma_origem_id', None),
            **validated_data  # Preenche os outros campos do modelo
        )
        
        return ped_instance
    
    def update(self, instance, validated_data):
        # Obter as chaves primárias (IDs) das entidades relacionadas
        aluno_id = validated_data.get('aluno_id', None)
        professor_ped_id = validated_data.get('professor_ped_id', None)
        professor_disciplina_id = validated_data.get('professor_disciplina_id', None)
        curso_id = validated_data.get('curso_id', None)
        disciplina_id = validated_data.get('disciplina_id', None)
        turma_origem_id = validated_data.get('turma_origem_id', None)

        # Atualizar os campos com as chaves primárias
        print(hasattr(instance, 'aluno'))
        if aluno_id:
            instance.aluno = UsuarioBase.objects.get(id=aluno_id)
        if professor_ped_id:
            instance.professor_ped = UsuarioBase.objects.get(id=professor_ped_id)
        if professor_disciplina_id:
            instance.professor_disciplina = UsuarioBase.objects.get(id=professor_disciplina_id)
        if curso_id:
            instance.curso = Curso.objects.get(id=curso_id)
        if disciplina_id:
            instance.disciplina = Disciplina.objects.get(id=disciplina_id)
        if turma_origem_id:
            instance.turma_origem = Turma.objects.get(id=turma_origem_id)

        # Atualizar os outros campos que não são chaves primárias
        for attr, value in validated_data.items():
            if attr.endswith('_id'):  # Ignorar campos com _id, pois já foram tratados
                continue
            setattr(instance, attr, value)

        # Salvar a instância atualizada
        instance.full_clean()
        instance.save()
        
        return instance
    
    def get_aluno(self, obj):
        if obj.aluno and hasattr(obj, 'aluno'):
            return obj.aluno.nome or obj.aluno.email.split('@')[0]
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
        curso = data.get('curso_id')
        disciplina = data.get('disciplina_id')
        serie_progressao = data.get('serie_progressao')
        turma_origem = data.get('turma_origem_id')

        if not disciplina.cursos.filter(id=curso.id).exists():
            raise serializers.ValidationError('A disciplina informada não pertence ao curso informado')
        
        if int(turma_origem.numero[0]) <= int(serie_progressao[0]):
            raise serializers.ValidationError('A série de progressão não pode ser inferior a turma de origem')
        
        return data
    
    def to_representation(self, instance):
        request = self.context.get('request')
        retornar_ids = request and request.query_params.get('retornar_ids') == 'true'
    
        representation = super().to_representation(instance)
    
        if retornar_ids:
            # Substitui os nomes/valores pelas IDs das instâncias relacionadas
            representation['aluno_id'] = instance.aluno.id if instance.aluno else None
            representation['professor_disciplina_id'] = instance.professor_disciplina.id if instance.professor_disciplina else None
            representation['professor_ped_id'] = instance.professor_ped.id if instance.professor_ped else None
            representation['curso_id'] = instance.curso.id if instance.curso else None
            representation['disciplina_id'] = instance.disciplina.id if instance.disciplina else None
            representation['turma_origem_id'] = instance.turma_origem.id if instance.turma_origem else None

            for field in ['aluno', 'professor_ped', 'professor_disciplina', 'curso', 'disciplina', 'turma_origem', 'plano_estudos', 'form_encerramento', 'data_criacao', 'data_inicio', 'data_final', 'nota_final', ]:
                representation.pop(field, None)
        else:
            for field in ['aluno_id', 'professor_ped_id', 'professor_disciplina_id', 'curso_id', 'disciplina_id', 'turma_origem_id', 'plano_estudos', 'form_encerramento', 'data_criacao']:
                representation.pop(field, None)
            
        return representation