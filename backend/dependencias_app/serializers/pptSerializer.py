from rest_framework import serializers
from dependencias_app.models.ppt import PPT
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer

class PPTSerializer(serializers.ModelSerializer):
    class Meta:
        model = PPT
        fields = '__all__'
    
    def save(self, **kwargs):
        formPPT = super().save(**kwargs)

        formPPT.full_clean()
        formPPT.save()
        return formPPT
    
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
        
        # consulta dados da turma de origem
        if hasattr(instance, 'turmaOrigem'):
            representation['turmaOrigem'] = TurmaSerializer(instance.turmaOrigem).data
        
        # consulta dados da turma de progressão
        if hasattr(instance, 'turmaProgressao'):
            representation['turmaProgressao'] = TurmaSerializer(instance.turmaProgressao).data

        # retorna os dados em vez de apenas os id's que fazem o vinculo entre cada instância da PPT
        return representation