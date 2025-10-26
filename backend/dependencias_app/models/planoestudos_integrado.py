from django.db import models
from .ped_integrado import PEDIntegrado
from .planoestudos import PlanoEstudos

class PlanoEstudosIntegrado(PlanoEstudos):
    ped = models.OneToOneField(PEDIntegrado, on_delete=models.DO_NOTHING, related_name='plano_estudos_emi')

    class Meta:
        abstract = False
