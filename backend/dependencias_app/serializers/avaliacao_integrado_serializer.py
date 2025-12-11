from rest_framework import serializers
from dependencias_app.formatters.format_avaliacoes import URLFieldsParser
from dependencias_app.models.atividade_integrado import AtividadeIntegrado
from dependencias_app.models.ped_integrado import PEDIntegrado
from ..models.avaliacao_integrado import AvaliacaoIntegrado
from django.utils import timezone


class AvaliacaoIntegradoSerializer(serializers.ModelSerializer):
    data_entrega = serializers.DateTimeField(
        format="%Y-%m-%dT%H:%M:%SZ",
        input_formats=[
            "%Y-%m-%d",
            "%Y-%m-%dT%H:%M",
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%dT%H:%M:%SZ",
            "%Y-%m-%dT%H:%M:%S.%fZ",
        ]
    )

    ped = serializers.PrimaryKeyRelatedField(queryset=PEDIntegrado.objects.all())
    atividade = serializers.PrimaryKeyRelatedField(queryset=AtividadeIntegrado.objects.all())

    class Meta:
        model = AvaliacaoIntegrado
        fields = "__all__"

    def validate(self, data):
        if isinstance(data, list):
            return self._validate_list(data)
        return self._validate_item(data)

    def _validate_item(self, item):

        atividade_id = item.get("atividade")
        ped = item.get("ped")

        avaliacao_existente = AvaliacaoIntegrado.objects.filter(
            ped_id=ped,
            atividade_id=atividade_id
        ).first()

        if avaliacao_existente and avaliacao_existente.nota is not None:
            nova_nota = item.get("nota")
            if nova_nota in (None, ""):
                raise serializers.ValidationError({
                    "Nota": "Não é permitido anular a nota após registro."
                })

        data_entrega = item.get("data_entrega")
        agora = timezone.now()

        if not data_entrega or data_entrega < agora:
            raise serializers.ValidationError({
                "data_entrega": "A data de entrega não pode ser menor que agora."
            })

        return item

    def _validate_list(self, items):
        atividades_vistas = set()

        for item in items:
            atividade_id = item.get("atividade")

            if atividade_id in atividades_vistas:
                raise serializers.ValidationError({
                    "atividade": "Não é permitido cadastrar avaliações duplicadas para a mesma atividade."
                })

            atividades_vistas.add(atividade_id)

            self._validate_item(item)

        return items


    def to_representation(self, instance):
        request = self.context.get("request")
        retorno = request.GET.get("retorno")

        if not retorno:
            raise serializers.ValidationError("O campo 'retorno' não pode ser nulo.")

        return URLFieldsParser.parse(instance, retorno)
