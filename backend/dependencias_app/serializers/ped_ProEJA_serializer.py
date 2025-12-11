from rest_framework import serializers
from ..models.usuario import Usuario
from ..models.ped_proeja import PEDProeja
from ..formatters.format_ped_proeja import URLFieldsParser

class PEDProejaSerializer(serializers.ModelSerializer):
    aluno = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.filter(group__name="aluno"),
        required=True
    )
    professor_disciplina = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.filter(group__name="professor"),
        required=True
    )
    curso = serializers.UUIDField()
    disciplina = serializers.UUIDField()
    periodo_letivo = serializers.UUIDField()

    class Meta:
        model = PEDProeja
        fields = '__all__'

    def validate(self, attrs):
        from ..models.ped_integrado import PEDIntegrado
        from ..models.ppt import PPT

        aluno = attrs.get('aluno')
        novo_status = attrs.get('status', getattr(self.instance, 'status', None))

        if not self.instance:
            peds_integrado = PEDIntegrado.objects.filter(aluno=aluno).exclude(status__in=["Desativada", "Finalizada"])

            ppts = PPT.objects.filter(aluno=aluno).exclude(status__in=["Desativada", "Finalizada"])

            peds_proeja = PEDProeja.objects.filter(aluno=aluno).exclude(status__in=["Desativada", "Finalizada"])

            if self.instance is None and peds_integrado.exists() or self.instance is None and ppts.exists():
                raise serializers.ValidationError({
                    "aluno": "Já existe uma PED da modalidade Integrado ou PPT ativa para este aluno."
                })
            
            total_proeja_ppt = peds_proeja.count()
            if total_proeja_ppt >= 2:
                raise serializers.ValidationError({
                    "aluno": "Já existem 2 PEDs ativos para este aluno."
                })
        else:
            status_atual = self.instance.status

            transicoes_validas = {
                "Criada": ["Criada","Em Andamento", "Desativada"],
                "Em Andamento": ["Em Adndamento", "Lançada", "Desativada"],
                "Lançada": ["Lançada", "Finalizada", "Desativada"],
                "Finalizada": ["Finalizada"], 
                "Desativada": ["Desativada"]
            }

            if status_atual not in transicoes_validas:
                raise serializers.ValidationError({"status": "Status atual inválido."})

            if novo_status not in transicoes_validas[status_atual]:
                raise serializers.ValidationError({
                    "status": f"Transição inválida de status"
                })

        return super().validate(attrs)
    
    def update(self, instance, validated_data):
        allowed_fields = {'observacao', 'status', 'data_final'}

        for field, new_value in validated_data.items():

            if field in allowed_fields:
                continue

            current_value = getattr(instance, field, None)

            if new_value != current_value:
                raise serializers.ValidationError({
                    field: f"Não é permitido alterar o campo '{field}'. "
                        f"Valor recebido difere do registrado."
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
        
        if "plano_estudos" in retorno:
            if hasattr(instance, "plano_estudos_proeja"):
                rep["plano_estudos"] = str(instance.plano_estudos_proeja.id)

        if "form_encerramento" in retorno:
            if hasattr(instance, "form_encerramento_proeja"):
                rep["form_encerramento"] = str(instance.form_encerramento_proeja.id)

        return URLFieldsParser.parse(rep, retorno)