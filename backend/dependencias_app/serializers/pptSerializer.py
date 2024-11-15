from rest_framework import serializers
from google_auth.models import UsuarioBase
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.turma import Turma
from dependencias_app.models.ppt import PPT

class PPTSerializer(serializers.ModelSerializer):
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

    def save(self, **kwargs):
        formPPT = super().save(**kwargs)

        formPPT.full_clean()
        formPPT.save()
        return formPPT
    
    def validate(self, data):
        curso_id = data.get('curso')
        disciplina_id = data.get('disciplina')
        turma_origem_id = data.get('turma_origem')
        turma_progressao_id = data.get('turma_progressao')

        print(curso_id)
        print(disciplina_id)

        curso = Curso.objects.get(id=curso_id)
        disciplina = Disciplina.objects.get(id=disciplina_id)
        turma_origem = Turma.objects.get(id=turma_origem_id)
        turma_progressao = Turma.objects.get(id=turma_progressao_id)


        if not disciplina.cursos.filter(id=curso.id).exists():
            raise serializers.ValidationError("A disciplina não está vinculada ao curso fornecido.")
        
        if turma_origem.curso.id != curso.id:
            raise serializers.ValidationError("A turma de origem não está vinculada ao curso fornecido.")
        
        if turma_progressao.curso.id != curso.id:
            raise serializers.ValidationError("A turma de progressao não está vinculada ao curso fornecido.")
        
        if int(turma_origem.numero) < int(turma_progressao.numero):
            raise serializers.ValidationError("A turma de origem não pode ser inferior à turma de progressão.")
        
        return data
    
    def get_aluno(self, obj):
        if obj.aluno and hasattr(obj, 'aluno'):
            return obj.aluno.nome or obj.aluno.email
        return None
    
    def get_professor_ppt(self, obj):
        if obj.professor_ppt and hasattr(obj, 'professor_ppt'):
            return obj.professor_ppt.nome or obj.professor_ppt.email
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
    
    def get_turma_progressao(self, obj):
        if obj.turma_progressao and hasattr(obj, 'turma_progressao'):
            return obj.turma_progressao.numero
        return None
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # retorna os dados em vez de apenas os id's que fazem o vinculo entre cada instância da PPT
        return representation