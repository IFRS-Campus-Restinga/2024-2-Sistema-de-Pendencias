from rest_framework import serializers
from google_auth.models import UsuarioBase
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.pedPROEJA import PED_PROEJA
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.planoEstudosSerializer import PlanoEstudosSerializer
from dependencias_app.serializers.formEncerramentoSerializer import FormEncerramentoSerializer

class PED_EMISerializer(serializers.ModelSerializer):
    aluno = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    professor = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.filter(modalidade='PROEJA'))
    disciplina = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())

    class Meta:
        model = PED_PROEJA
        fields = '__all__'
    
    def save(self, **kwargs):
        formPED_EMI = super().save(**kwargs)

        formPED_EMI.full_clean()
        formPED_EMI.save()
        return formPED_EMI
    
    def validate(self, data):
        curso = data.get('curso')
        disciplina = data.get('disciplina')

        if not disciplina.cursos.filter(curso_id=curso).exists():
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
        
        # consulta dados da turma de origem
        if hasattr(instance, 'plano_estudos'):
            representation['plano_estudos'] = PlanoEstudosSerializer(instance.plano_estudos).data
        
        # consulta dados da turma de progressão
        if hasattr(instance, 'form_encerramento'):
            representation['form_encerramento'] = FormEncerramentoSerializer(instance.form_encerramento).data

        # retorna os dados em vez de apenas os id's que fazem o vinculo entre cada instância da PED
        return representation
