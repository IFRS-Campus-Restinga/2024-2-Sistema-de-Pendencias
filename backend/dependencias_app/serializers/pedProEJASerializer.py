from rest_framework import serializers
from google_auth.models import UsuarioBase
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.planoEstudosSerializer import PlanoEstudos_Serializer
from dependencias_app.serializers.formEncerramentoSerializer import FormEncerramentoSerializer

class PED_ProEJA_Serializer(serializers.ModelSerializer):
    # variáveis de entrada do serializer (POST), recebe as chaves primárias para vincular as tabelas
    aluno = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    professor_disciplina = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    professor_ped = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.filter(modalidade='ProEJA'))
    disciplina = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())

    class Meta:
        model = PED_ProEJA
        fields = '__all__'

    def save(self, **kwargs):
        formPED_ProEJA = super().save(**kwargs)

        formPED_ProEJA.full_clean()
        formPED_ProEJA.save()
        return formPED_ProEJA
    
    def validate(self, attrs):
        validated_data = super().validate(attrs)

        curso = validated_data.get('curso', None)
        disciplina = validated_data.get('disciplina', None)

        if not disciplina.cursos.filter(id=curso.id).exists(): raise serializers.ValidationError("Disciplina não vinculada ao curso da PED")

        return validated_data   
     
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Verifica se a requisição pediu representação detalhada
        request = self.context.get('request', None)
        incluir_dados = request and request.query_params.get('incluir_dados')

        if incluir_dados:
            representation['aluno'] = str(instance.aluno)
            representation['professor_disciplina'] = str(instance.professor_disciplina)
            representation['professor_ped'] = str(instance.professor_ped)
            representation['curso'] = str(instance.curso)
            representation['disciplina'] = str(instance.disciplina)
            
        representation.pop('data_criacao')
        representation.pop('plano_estudos')
        representation.pop('form_encerramento')

        return representation