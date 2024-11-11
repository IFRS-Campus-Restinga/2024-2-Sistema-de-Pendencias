from rest_framework import serializers
from dependencias_app.models.planoEstudos import PlanoEstudos
from google_auth.models import UsuarioBase
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.enums.trimestreRec import TrimestreRec
from dependencias_app.enums.formaOferta import FormaOferta
from dependencias_app.enums.turnos import Turnos

class PlanoEstudosSerializer(serializers.ModelSerializer):
    aluno = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all())
    disciplina = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())
    trimestre_recuperacao = serializers.ChoiceField(choices=TrimestreRec.choices)  # Alterado para ChoiceField
    forma_oferta = serializers.ChoiceField(choices=FormaOferta.choices)  # Alterado para ChoiceField
    turno = serializers.ChoiceField(choices=Turnos.choices)  # Alterado para ChoiceField

    class Meta:
        model = PlanoEstudos
        fields = '__all__'

    def save(self, **kwargs):
        formPlanoEstudo = super().save(**kwargs)
        formPlanoEstudo.full_clean()
        formPlanoEstudo.save()
        return formPlanoEstudo

    def validate(self, data):
        curso = data.get('curso')
        disciplina = data.get('disciplina')
        trimestre_recuperacao = data.get('trimestre_recuperacao')
        forma_oferta = data.get('forma_oferta')
        turno = data.get('turno')

        # Exemplo de validação: Certifique-se de que a disciplina está vinculada ao curso selecionado
        if not disciplina.cursos.filter(id=curso.id).exists():
            raise serializers.ValidationError("A disciplina não está vinculada ao curso fornecido.")

        # Exemplo de validação: Verifique se o trimestre de recuperação está correto
        if trimestre_recuperacao and trimestre_recuperacao.numero < 1:
            raise serializers.ValidationError("O trimestre de recuperação deve ser válido.")

        # Adicione outras validações conforme necessário...

        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Consultar dados do aluno
        if hasattr(instance, 'aluno'):
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data

        # Consultar dados do curso
        if hasattr(instance, 'curso'):
            representation['curso'] = CursoSerializer(instance.curso).data

        # Consultar dados da disciplina
        if hasattr(instance, 'disciplina'):
            representation['disciplina'] = DisciplinaSerializer(instance.disciplina).data

        # Consultar dados do trimestre de recuperação
        if hasattr(instance, 'trimestre_recuperacao'):
            representation['trimestre_recuperacao'] = TrimestreRec(instance.trimestre_recuperacao).label  # Usando label

        # Consultar dados da forma de oferta
        if hasattr(instance, 'forma_oferta'):
            representation['forma_oferta'] = FormaOferta(instance.forma_oferta).label  # Usando label

        # Consultar dados do turno
        if hasattr(instance, 'turno'):
            representation['turno'] = Turnos(instance.turno).label  # Usando label

        return representation
