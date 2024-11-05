from rest_framework import serializers
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.planoEstudosSerializer import PlanoEstudosSerializer
from dependencias_app.serializers.formEncerramentoSerializer import FormEncerramentoSerializer

class PED_EMISerializer(serializers.ModelSerializer):

    class Meta:
        model = PED_EMI
        fields = '__all__'
    
    def save(self, **kwargs):
        formPED_EMI = super().save(**kwargs)

        formPED_EMI.full_clean()
        formPED_EMI.save()
        return formPED_EMI
    
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
        if hasattr(instance, 'plano_estudos'):
            representation['plano_estudos'] = PlanoEstudosSerializer(instance.plano_estudos).data
        
        # consulta dados da turma de progressão
        if hasattr(instance, 'form_encerramento'):
            representation['form_encerramento'] = FormEncerramentoSerializer(instance.form_encerramento).data

        # retorna os dados em vez de apenas os id's que fazem o vinculo entre cada instância da PED
        return representation


