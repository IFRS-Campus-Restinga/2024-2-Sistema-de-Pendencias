from rest_framework import serializers
from ..models.acompanhamento_proeja import AcompanhamentoProeja

class AcompanhamentoProejaSerializer(serializers.ModelSerializer):

    class Meta:
        model = AcompanhamentoProeja
        fields = '__all__'

    def validate(self, data):
        ped = data.get('ped') or getattr(self.instance, 'ped', None)

        if ped:
            if ped.status in ['Lançada', 'Finalizada', 'Desativada']:
                raise serializers.ValidationError(
                    {"ped": "Não é possível adicionar acompanhamento a uma PED Lançada, Finalizada ou Desativada."}
                )

        return data