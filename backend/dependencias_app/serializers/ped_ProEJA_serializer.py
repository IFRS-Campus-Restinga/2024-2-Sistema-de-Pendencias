from rest_framework import serializers
from ..models.custom_user import CustomUser
from ..models.ped_ProEJA import PEDProEJA
from ..formatters.format_ped_proeja import URLFieldsParser

class PEDProEJASerializer(serializers.ModelSerializer):
    aluno = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(group__name="aluno"),
        required=True
    )
    professor_disciplina = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(group__name="professor"),
        required=True
    )
    curso = serializers.UUIDField()
    disciplina = serializers.UUIDField()
    periodo_letivo = serializers.UUIDField()
    turma_atual = serializers.UUIDField()

    class Meta:
        model = PEDProEJA
        fields = '__all__'

    def validate(self, attrs):
        from ..models.ped_integrado import PEDIntegrado
        from ..models.ppt import PPT

        aluno = attrs.get('aluno')

        peds_integrado = PEDIntegrado.objects.filter(aluno=aluno).exclude(status__in=["Desativada", "Finalizada"])

        ppts = PPT.objects.filter(aluno=aluno).exclude(status__in=["Desativada", "Finalizada"])

        peds_proeja = PEDProEJA.objects.filter(aluno=aluno).exclude(status__in=["Desativada", "Finalizada"])

        if self.instance is None and peds_proeja.exists():
            raise serializers.ValidationError({
                "aluno": "Já existe uma PED da modalidade Proeja ativa para este aluno."
            })
        
        total_integrado_ppt = peds_integrado.count() + ppts.count()
        if total_integrado_ppt >= 2:
            raise serializers.ValidationError({
                "aluno": "Já existem 2 PEDs/PPTs ativos para este aluno."
            })

        return super().validate(attrs)
    
    def update(self, instance, validated_data):
        invalid_fields = [
            field for field in validated_data.keys()
            if field != 'observacao' and field != 'status'
        ]

        if invalid_fields:
            raise serializers.ValidationError({
                "Campos inválidos": f"Apenas os campos observação e status podem ser alterados"
            })

        return super().update(instance, validated_data)

    def to_representation(self, instance):
        request = self.context.get('request')
        retorno = request.GET.get("retorno", None)

        if not retorno:
            raise serializers.ValidationError('O campo retorno não pode ser nulo.')

        rep = super().to_representation(instance)

        if "professores" in retorno:
            # adiciona os IDs de professores_proeja no dicionário
            rep['professores'] = [{'id': str(p.professor.id), 'resp_atual': p.responsavel_atual} for p in instance.professores_proeja.all()]
        
        if "professor_ped" in retorno:
            rep['professor_ped'] = str(instance.professores_proeja.filter(responsavel_atual=True).first().professor.id)
        
        return URLFieldsParser.parse(rep, retorno)