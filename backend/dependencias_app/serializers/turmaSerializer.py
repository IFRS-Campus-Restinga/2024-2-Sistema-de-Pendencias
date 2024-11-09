from rest_framework import serializers
from dependencias_app.models.turma import Turma
from dependencias_app.models.curso import Curso

class TurmaSerializer(serializers.ModelSerializer):
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all())
    class Meta:
        model = Turma
        fields = '__all__'
    
    def save(self, **kwargs):
        formTurma = super().save(**kwargs)

        formTurma.full_clean()
        formTurma.save()
        return formTurma


