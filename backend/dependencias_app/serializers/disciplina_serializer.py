from rest_framework import serializers
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.curso import Curso

class Disciplina_Serializer(serializers.ModelSerializer):
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

        if cursos_data is None:  
            return serializers.ValidationError('A disciplina precisa estar vinculada a pelo menos um curso')

        else:
            # Extrai os IDs dos cursos (se você está recebendo objetos inteiros ou dicionários)
            cursos_ids = [curso.id for curso in cursos_data] if isinstance(cursos_data, list) else [curso_data['id'] for curso_data in cursos_data]

            # Atualiza os cursos relacionados com os IDs extraídos
            instance.cursos.set(cursos_ids)

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'lista':
            if hasattr(instance, 'cursos'):
                representation['cursos'] = ", ".join([curso.nome for curso in instance.cursos.all()])

        return representation