from django.db import models
from .avaliacao import Avaliacao
from .ped_proeja import PEDProEJA
from .atividade_proeja import AtividadeProEJA

class AvaliacaoProEJA(Avaliacao):
    ped = models.ForeignKey(PEDProEJA, on_delete=models.DO_NOTHING, related_name='atividades_proeja')
    atividade = models.ForeignKey(AtividadeProEJA, on_delete=models.DO_NOTHING, related_name='dependencias_proeja')
    
    class Meta:
        abstract = False
        verbose_name = "Avaliações ProEJA"
