from rest_framework import serializers
from google_auth.models import UsuarioBase
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.turma import Turma
from dependencias_app.models.ppt import PPT
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer

class PPTSerializer(serializers.ModelSerializer):
    aluno = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.filter(modalidade='Integrado'))
    disciplina = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())
    turmaOrigem = serializers.PrimaryKeyRelatedField(queryset=Turma.objects.all())
    turmaProgressao = serializers.PrimaryKeyRelatedField(queryset=Turma.objects.all())

    class Meta:
        model = PPT
        fields = '__all__'
    
    def save(self, **kwargs):
        formPPT = super().save(**kwargs)

        formPPT.full_clean()
        formPPT.save()
        return formPPT
    
    def validate(self, data):
        curso = data.get('curso')
        disciplina = data.get('disciplina')
        turmaOrigem = data.get('turmaOrigem')
        turmaProgressao = data.get('turmaProgressao')

        if not disciplina.cursos.filter(id=curso.id).exists():
            raise serializers.ValidationError("A disciplina não está vinculada ao curso fornecido.")
        
        if turmaOrigem.curso.id != curso.id:
            raise serializers.ValidationError("A turma de origem não está vinculada ao curso fornecido.")
        
        if turmaProgressao.curso.id != curso.id:
            raise serializers.ValidationError("A turma de progressao não está vinculada ao curso fornecido.")
        
        if int(turmaOrigem.numero) < int(turmaProgressao.numero):
            raise serializers.ValidationError("A turma de origem não pode ser inferior à turma de progressão.")
        
        return data
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # consultar dados do aluno
        if hasattr(instance, 'aluno'):
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data
        
        # consulta dados do curso
        if hasattr(instance, 'curso'):
            representation['curso'] = CursoSerializer(instance.curso).data
        
        # consulta dados da disciplina
        if hasattr(instance, 'disciplina'):
            representation['disciplina'] = DisciplinaSerializer(instance.disciplina).data
        
        # consulta dados da turma de origem
        if hasattr(instance, 'turmaOrigem'):
            representation['turmaOrigem'] = TurmaSerializer(instance.turmaOrigem).data
        
        # consulta dados da turma de progressão
        if hasattr(instance, 'turmaProgressao'):
            representation['turmaProgressao'] = TurmaSerializer(instance.turmaProgressao).data

        # retorna os dados em vez de apenas os id's que fazem o vinculo entre cada instância da PPT
        return representation