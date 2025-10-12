from django.db import models
from .ped_proeja import PEDProEJA
from .planoestudos import PlanoEstudos

class PlanoEstudosProEJA(PlanoEstudos):
    ped = models.OneToOneField(PEDProEJA, on_delete=models.DO_NOTHING, related_name='plano_estudos_proeja')

    class Meta:
        abstract = False