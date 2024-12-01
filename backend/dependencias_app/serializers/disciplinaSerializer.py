from rest_framework import serializers
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.curso import Curso

class DisciplinaSerializer(serializers.ModelSerializer):
    cursos = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all(), many=True)

    class Meta:
        model = Disciplina
        fields = '__all__'
    
    def save(self, **kwargs):
        formDisciplina = super().save(**kwargs)

        formDisciplina.full_clean()
        formDisciplina.save()
        return formDisciplina
    
    def update(self, instance, validated_data):
        cursos_data = validated_data.pop('cursos', None)

        # Atualiza outros campos normalmente
        instance = super().update(instance, validated_data)

        if cursos_data is not None:
            # Define os cursos relacionados diretamente
            instance.cursos.set(cursos_data)

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'lista':
            if hasattr(instance, 'cursos'):
                representation['cursos'] = ", ".join([curso.nome for curso in instance.cursos.all()])

        return representation