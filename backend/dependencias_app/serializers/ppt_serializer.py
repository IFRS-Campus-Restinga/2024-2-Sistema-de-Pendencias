from rest_framework import serializers
from dependencias_app.models.ppt import PPT
from ..models.usuario import Usuario
from ..formatters.format_ppt import URLFieldsParser

class PPTSerializer(serializers.ModelSerializer):
    aluno = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.filter(group__name="aluno"),
        required=True
    )
    professor_disciplina = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.filter(group__name="professor"),
        required=True
    )
    professor_ppt = serializers.PrimaryKeyRelatedField(
            queryset=Usuario.objects.filter(group__name="professor"),
            required=True
        )    
    curso = serializers.UUIDField()
    disciplina = serializers.UUIDField()
    turma_atual = serializers.UUIDField()
    turma_progressao = serializers.UUIDField()
    nota_final = serializers.FloatField(required=False, allow_null=True)

    class Meta:
        model = PPT
        fields = '__all__'

    def validate(self, attrs):
        from ..models.ped_proeja import PEDProeja
        from ..models.ped_integrado import PEDIntegrado

        aluno = attrs.get('aluno')
        if not self.instance:
            peds_integrado = PEDIntegrado.objects.filter(aluno=aluno).exclude(status__in=["Desativada", "Finalizada"])

            ppts = PPT.objects.filter(aluno=aluno).exclude(status__in=["Desativada", "Finalizada"])

            peds_proeja = PEDProeja.objects.filter(aluno=aluno).exclude(status__in=["Desativada", "Finalizada"])

            if self.instance is None and peds_proeja.exists():
                raise serializers.ValidationError({
                    "aluno": "Já existe uma PED da modalidade Proeja ativa para este aluno."
                })
            
            total_integrado_ppt = peds_integrado.count() + ppts.count()
            if total_integrado_ppt >= 2:
                raise serializers.ValidationError({
                    "aluno": "Já existem 2 PEDs/PPTs ativos para este aluno."
                })
        else:
            status = attrs.get('status')
            nota = attrs.get('nota_final')

            if status == 'Criada' and nota:
                raise serializers.ValidationError({
                    "nota": "Esta PPT não pode receber nota ainda."
                })
            
            if status == 'Finalizada' and not nota:
                raise serializers.ValidationError({
                    "nota": "É necessário registrar uma nota para finalizar esta PPT."
                })
            
            transicoes_validas = {
                "Criada": ["Criada","Em Andamento", "Desativada"],
                "Em Andamento": ["Em Adndamento", "Lançada", "Desativada"],
                "Lançada": ["Lançada", "Finalizada", "Desativada"],
                "Finalizada": ["Finalizada"], 
                "Desativada": ["Desativada"]
            }

            if self.instance.status not in transicoes_validas:
                raise serializers.ValidationError({"status": "Status atual inválido."})

            if status not in transicoes_validas[self.instance.status]:
                raise serializers.ValidationError({
                    "status": f"Transição inválida de status"
                })


        return super().validate(attrs)
    
    def to_representation(self, instance):
        request = self.context.get('request')
        retorno = request.GET.get("retorno", None)

        if not retorno:
            raise serializers.ValidationError('O campo retorno não pode ser nulo.')

        rep = super().to_representation(instance)
        
        return URLFieldsParser.parse(rep, retorno)
