from django.db import models
from .ped_proeja import PEDProeja
from .planoestudos import PlanoEstudos

class PlanoEstudosProeja(PlanoEstudos):
    ped = models.OneToOneField(PEDProeja, on_delete=models.DO_NOTHING, related_name='plano_estudos_proeja')

    class Meta:
        abstract = False
