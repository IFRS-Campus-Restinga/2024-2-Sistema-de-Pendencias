from rest_framework import serializers
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from google_auth.models import UsuarioBase
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer

class CursoSerializer(serializers.ModelSerializer):
    turmas = TurmaSerializer(many=True, read_only=True)
    disciplinas = DisciplinaSerializer(many=True, read_only=True)
    coordenador = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Coordenador')) 

    class Meta:
        model = Curso
        fields = '__all__'

    def save(self, **kwargs):
        formCurso = super().save(**kwargs)
        formCurso.full_clean()
        formCurso.save()
        return formCurso
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'lista':
            if hasattr(instance, 'coordenador'):
                representation['coordenador'] = str(instance.coordenador)

            representation.pop('turmas')
            representation.pop('disciplinas')

        elif retorno == 'dependencia':
            if hasattr(instance, 'turmas'):
                # Aqui, você usa o Serializador de Turma para representar as turmas corretamente
                representation['turmas'] = TurmaSerializer(instance.turmas.all(), many=True).data
            if hasattr(instance, 'disciplinas'):
                # Serializa as disciplinas também
                representation['disciplinas'] = DisciplinaSerializer(instance.disciplinas.all().order_by('nome'), many=True).data

        return representation