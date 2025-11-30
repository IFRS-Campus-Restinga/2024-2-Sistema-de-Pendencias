from rest_framework import serializers
from dependencias_app.formatters.format_avaliacoes import URLFieldsParser
from dependencias_app.models.atividade_proeja import AtividadeProeja
from dependencias_app.models.ped_proeja import PEDProeja
from ..models.avaliacao_proeja import AvaliacaoProeja
from datetime import datetime


class AvaliacaoProejaSerializer(serializers.ModelSerializer):
    data_entrega = serializers.DateField(format="%Y-%m-%d")
    ped = serializers.PrimaryKeyRelatedField(queryset=PEDProeja.objects.all())
    atividade = serializers.PrimaryKeyRelatedField(queryset=AtividadeProeja.objects.all())

    class Meta:
        model = AvaliacaoProeja
        fields = "__all__"

    def validate(self, data):
        """
        Este método aceita tanto UM item quanto UMA LISTA,
        porque o serviço sempre envia uma lista com many=True.
        """
        if isinstance(data, list):
            return self._validate_list(data)

        return self._validate_item(data)

    def _validate_item(self, item):
        atividade_id = item.get("atividade")
        ped = item.get("ped")

        avaliacao_existente = AvaliacaoProeja.objects.filter(
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

        if not data_entrega or data_entrega < datetime.today().date():
            raise serializers.ValidationError({
                "Data entrega": "A data de entrega não pode ser menor que hoje."
            })

        return item

    def _validate_list(self, items):
        erros = []
        atividades_vistas = set()

        for idx, item in enumerate(items):
            atividade_id = item.get("atividade")

            if atividade_id in atividades_vistas:
                raise serializers.ValidationError(
                    {"atividade": f"Não é permitido cadastrar avaliações com atividades duplicadas"}
                )

            atividades_vistas.add(atividade_id)

            self._validate_item(item)

        return items

    def to_representation(self, instance):
        request = self.context.get("request")
        retorno = request.GET.get("retorno")

        if not retorno:
            raise serializers.ValidationError("O campo 'retorno' não pode ser nulo.")

        return URLFieldsParser.parse(instance, retorno)
