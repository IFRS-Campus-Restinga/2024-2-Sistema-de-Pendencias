from rest_framework import serializers
from ..models.ped_integrado import PEDIntegrado
from ..models.ped_ProEJA import PEDProEJA
from ..serializers.ped_integrado_serializer import PEDIntegradoSerializer
from ..serializers.ped_ProEJA_serializer import PEDProEJASerializer


def validar_modalidade(modalidade: str) -> tuple[PEDIntegrado, PEDIntegradoSerializer] | tuple[PEDProEJA, PEDProEJASerializer]:
    """Retorna uma tupla contendo o model da PED e o Serializer respectivo"""
    if modalidade == 'Integrado':
        return (PEDIntegrado, PEDIntegradoSerializer)
    elif modalidade == 'ProEJA':
        return (PEDProEJA, PEDProEJASerializer)
    else:
        raise serializers.ValidationError({'modalidade': 'Modalidade inválida'})
