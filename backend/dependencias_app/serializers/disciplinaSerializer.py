from rest_framework import serializers
from dependencias_app.models.disciplina import Disciplina

class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = '__all__'
    
    def save(self, **kwargs):
        formDisciplina = super().save(**kwargs)

        formDisciplina.full_clean()
        formDisciplina.save()
        return formDisciplina
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if hasattr(instance, 'cursos'):
            representation['cursos'] = ", ".join([curso.nome for curso in instance.cursos.all()])

        return representation