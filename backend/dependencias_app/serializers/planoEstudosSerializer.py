from rest_framework import serializers
from backend.dependencias_app.models.planoEstudosEMI import PlanoEstudos
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.enums.trimestreRec import TrimestreRec
from dependencias_app.enums.formaOferta import FormaOferta
from dependencias_app.enums.turnos import Turnos
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBase

class PlanoEstudosSerializer(serializers.ModelSerializer):
    # aluno = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    # curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all())
    # disciplina = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())
    trimestre_recuperacao = serializers.ChoiceField(choices=TrimestreRec.choices)
    forma_oferta = serializers.ChoiceField(choices=FormaOferta.choices)
    turno = serializers.ChoiceField(choices=Turnos.choices)

    class Meta:
        model = PlanoEstudos
        fields = '__all__'

    def save(self, **kwargs):
        formPlanoEstudo = super().save(**kwargs)
        formPlanoEstudo.full_clean()  # Valida os dados antes de salvar
        formPlanoEstudo.save()
        return formPlanoEstudo

    def validate(self, data):
        # Verificando se os campos obrigatórios estão presentes
        required_fields = ['trimestre_recuperacao', 'forma_oferta', 'turno']
        for field in required_fields:
            if field not in data:
                raise serializers.ValidationError(f'O campo {field} é obrigatório.')

        # curso = data.get('curso')
        # disciplina = data.get('disciplina')
        trimestre_recuperacao = data.get('trimestre_recuperacao')
        forma_oferta = data.get('forma_oferta')
        turno = data.get('turno')

        # Verificação adicional
        # if not disciplina.cursos.filter(id=curso.id).exists():
        #     raise serializers.ValidationError("A disciplina não está vinculada ao curso fornecido.")
        
        if trimestre_recuperacao and trimestre_recuperacao.numero < 1:
            raise serializers.ValidationError("O trimestre de recuperação deve ser válido.")

        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if hasattr(instance, 'aluno'):
            representation['aluno'] = UsuarioBaseSerializer(instance.aluno).data

        if hasattr(instance, 'curso'):
            representation['curso'] = CursoSerializer(instance.curso).data

        if hasattr(instance, 'disciplina'):
            representation['disciplina'] = DisciplinaSerializer(instance.disciplina).data

        if hasattr(instance, 'trimestre_recuperacao'):
            representation['trimestre_recuperacao'] = TrimestreRec(instance.trimestre_recuperacao).label

        if hasattr(instance, 'forma_oferta'):
            representation['forma_oferta'] = FormaOferta(instance.forma_oferta).label

        if hasattr(instance, 'turno'):
            representation['turno'] = Turnos(instance.turno).label

        return representation
