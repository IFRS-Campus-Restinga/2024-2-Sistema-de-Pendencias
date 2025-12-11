from rest_framework import serializers
from uuid import UUID
from datetime import datetime
from dependencias_app.models.ped_proeja import PEDProeja
from dependencias_app.formatters.format_form_encerramento import URLFieldsParser
from ..models.formencerramento_proeja import FormEncerramentoProeja


class FormEncerramentoProejaSerializer(serializers.ModelSerializer):
    ped = serializers.PrimaryKeyRelatedField(queryset=PEDProeja.objects.all())
    atividades = serializers.ListField(write_only=True)
    nota = serializers.FloatField(write_only=True)

    class Meta:
        model = FormEncerramentoProeja
        fields = ["id", "parecer_final", "ped", "atividades", "nota"]
        extra_kwargs = {
            "atividades": {"write_only": True},
            "nota": {"write_only": True},
        }

    def _parse_date(self, value):
        if not value:
            raise ValueError("Data vazia.")

        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except:
            pass

        try:
            return datetime.strptime(value, "%Y-%m-%d")
        except:
            pass

        raise ValueError("Formato de data inválido.")

    def to_internal_value(self, data):
        internal = super().to_internal_value(data)

        atividades = data.get("atividades", [])
        nota_raw = data.get("nota")

        try:
            internal["nota"] = float(nota_raw)
        except Exception:
            raise serializers.ValidationError({"nota": "A nota deve ser um número."})

        lista_convertida = []

        for item in atividades:
            nova = item.copy()

            try:
                dtc = self._parse_date(item["data_criacao"])
                nova["data_criacao"] = dtc.strftime("%d/%m/%Y")
            except:
                raise serializers.ValidationError({"data_criacao": "Data inválida."})

            try:
                dte = self._parse_date(item["data_entrega"])
                nova["data_entrega"] = dte.strftime("%d/%m/%Y")
            except:
                raise serializers.ValidationError({"data_entrega": "Data inválida."})

            lista_convertida.append(nova)

        internal["atividades"] = lista_convertida

        return internal

    def validate(self, data):
        parecer = data.get("parecer_final")
        if not parecer or not str(parecer).strip():
            raise serializers.ValidationError("O parecer final não pode ser nulo ou vazio.")

        nota = data.get("nota")
        if nota is None:
            raise serializers.ValidationError("A nota final é obrigatória.")

        atividades = data.get("atividades")
        if not isinstance(atividades, list) or len(atividades) == 0:
            raise serializers.ValidationError("Atividades deve ser uma lista não vazia.")
        else:
            self._validar_lista_de_atividades(atividades)

        return data

    def _validar_lista_de_atividades(self, atividades):
        for item in atividades:

            atividade_info = item.get("atividade")
            if not isinstance(atividade_info, dict) or not atividade_info.get("titulo"):
                raise serializers.ValidationError({"Atividade": "Título obrigatório."})

            dt_criacao = datetime.strptime(item["data_criacao"], "%d/%m/%Y")
            dt_entrega = datetime.strptime(item["data_entrega"], "%d/%m/%Y")

            if dt_criacao >= dt_entrega:
                raise serializers.ValidationError(
                    "Data de criação deve ser menor que a data de entrega."
                )

    def create(self, validated_data):
        validated_data.pop("atividades", None)
        validated_data.pop("nota", None)
        return FormEncerramentoProeja.objects.create(**validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("atividades", None)
        validated_data.pop("nota", None)
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        request = self.context.get('request')
        retorno = request.GET.get("retorno")

        if not retorno:
            raise serializers.ValidationError('O campo retorno não pode ser nulo.')

        return URLFieldsParser.parse(instance, retorno)
