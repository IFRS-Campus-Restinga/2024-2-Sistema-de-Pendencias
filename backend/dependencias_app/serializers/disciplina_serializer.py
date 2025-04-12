from rest_framework import serializers
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.curso import Curso

class Disciplina_Serializer(serializers.ModelSerializer):
    cursos = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all(), many=True)

    class Meta:
        model = Disciplina
        fields = '__all__'

    def save(self, **kwargs):
        cursos = self.validated_data.pop('cursos', None)

        if not cursos:
            raise serializers.ValidationError({'cursos': 'A disciplina precisa estar vinculada a pelo menos um curso'})

        instance = super().save(**kwargs)

        instance.cursos.set(cursos)

        return instance
    
    def validate_nome(self, value):
        nome = value.strip()

        if len(nome) < 3:
            raise serializers.ValidationError("O nome da disciplina deve ter pelo menos 3 caracteres.")

        if len(nome) > 30:
            raise serializers.ValidationError("O nome da disciplina deve ter no máximo 30 caracteres.")

        if not nome:
            raise serializers.ValidationError("O nome da disciplina não pode estar vazio ou conter apenas espaços.")

        return nome

    def validate_carga_horaria(self, value):
        if int(value) <= 0:
            raise serializers.ValidationError("A carga horária deve ser maior que 0.")
        elif int(value) >= 100:
            raise serializers.ValidationError("A carga horária deve ser menor que 100.")

        return value

    def validate_cursos(self, value):
        if not value or len(value) == 0:
            raise serializers.ValidationError('A disciplina precisa estar vinculada a pelo menos um curso.')
        return value

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'lista' and hasattr(instance, 'cursos'):
            representation['cursos'] = ", ".join([curso.nome for curso in instance.cursos.all()])

        return representation
