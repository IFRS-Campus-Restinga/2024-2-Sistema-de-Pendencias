from rest_framework import serializers
from datetime import datetime
from django.utils import timezone
from google_auth.models import UsuarioBase
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.turma import Turma
from dependencias_app.models.ppt import PPT
from dependencias_app.models.calendarioAcademico import CalendarioAcademico

class PPTSerializer(serializers.ModelSerializer):
    # variáveis de entrada do serializer (POST), recebe as chaves primárias das tabelas que se relacionam com ppt
    aluno = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Aluno'))
    professor_ppt = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    professor_disciplina = serializers.PrimaryKeyRelatedField(queryset=UsuarioBase.objects.filter(grupo__name='Professor'))
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.filter(modalidade='Integrado'))
    disciplina = serializers.PrimaryKeyRelatedField(queryset=Disciplina.objects.all())
    turma_atual = serializers.PrimaryKeyRelatedField(queryset=Turma.objects.all())
    turma_progressao = serializers.PrimaryKeyRelatedField(queryset=Turma.objects.all())

    class Meta:
        model = PPT
        fields = '__all__'
    
    def create(self, validated_data):
        hoje = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)  # Hora ajustada para 00:00:00

        calendario = CalendarioAcademico.objects.filter(data_inicio__gte=hoje, tipo_calendario='Integrado').order_by('data_inicio').first()

        if calendario:
            # Atualiza as datas de início e final com o calendário encontrado
            validated_data['data_inicio'] = calendario.data_inicio.date()
            validated_data['data_final'] = calendario.data_fim.date()

        # Cria o objeto PPT com os dados validados
        ppt = super().create(validated_data)

        return ppt

    def validate(self, data):
        curso = data.get('curso')
        disciplina = data.get('disciplina')
        turma_atual = data.get('turma_atual')
        turma_progressao = data.get('turma_progressao')

        # Verifica se a disciplina está vinculada ao curso
        if not disciplina.cursos.filter(id=curso.id).exists():
            raise serializers.ValidationError("A disciplina não está vinculada ao curso fornecido.")
        
        # Verifica se as turmas pertencem ao curso
        if turma_atual.curso.id != curso.id:
            raise serializers.ValidationError("A turma de origem não está vinculada ao curso fornecido.")
        
        if turma_progressao.curso.id != curso.id:
            raise serializers.ValidationError("A turma de progressão não está vinculada ao curso fornecido.")
        
        # Verifica se a turma de origem não é inferior à de progressão
        if int(turma_atual.numero) < int(turma_progressao.numero):
            raise serializers.ValidationError("A turma de origem não pode ser inferior à turma de progressão.")
        
        return data
    
    def set_status(self, ppt, status):
        ppt.status = status
        ppt.save()

        return ppt
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Verifica se a requisição pediu representação detalhada
        request = self.context.get('request', None)
        incluir_dados = request and request.query_params.get('incluir_dados')

        if incluir_dados:
            representation['aluno'] = str(instance.aluno)
            representation['professor_disciplina'] = str(instance.professor_disciplina)
            representation['professor_ppt'] = str(instance.professor_ppt)
            representation['curso'] = str(instance.curso)
            representation['disciplina'] = str(instance.disciplina)
            representation['turma_atual'] = str(instance.turma_atual)
            representation['turma_progressao'] = str(instance.turma_progressao)
            
        representation.pop('data_criacao')


        return representation