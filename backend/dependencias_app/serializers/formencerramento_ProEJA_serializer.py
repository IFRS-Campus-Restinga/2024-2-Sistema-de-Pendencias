from rest_framework import serializers
from uuid import UUID
from datetime import datetime
from dependencias_app.models.formencerramento_proeja import FormEncerramentoProeja
from dependencias_app.models.ped_proeja import PEDProeja
from dependencias_app.formatters.format_form_encerramento import URLFieldsParser


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

    def to_internal_value(self, data):
        internal = super().to_internal_value(data)

        atividades = data.get("atividades", [])
        nota_raw = data.get("nota")

        # Converter nota para float
        try:
            internal["nota"] = float(nota_raw)
        except Exception:
            raise serializers.ValidationError({"nota": "A nota deve ser um número."})

        lista_convertida = []
        for item in atividades:
            nova = item.copy()

            try:
                dtc = datetime.strptime(item["data_criacao"], "%Y-%m-%d")
                nova["data_criacao"] = dtc.strftime("%d/%m/%Y")
            except:
                raise serializers.ValidationError({"data_criacao": "Data inválida."})

            try:
                dte = datetime.strptime(item["data_entrega"], "%Y-%m-%d")
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

            # agora datas já vêm no formato d/m/Y — converter de volta para comparar
            dt_criacao = datetime.strptime(item["data_criacao"], "%d/%m/%Y")
            dt_entrega = datetime.strptime(item["data_entrega"], "%d/%m/%Y")

            if dt_criacao >= dt_entrega:
                raise serializers.ValidationError(
                    "Data de criação deve ser menor que a data de entrega."
                )

    # ---------------------------------------------------------
   
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
