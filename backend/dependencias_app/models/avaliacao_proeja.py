from django.db import models
from .avaliacao import Avaliacao
from .ped_proeja import PEDProeja
from .atividade_proeja import AtividadeProeja

class AvaliacaoProeja(Avaliacao):
    ped = models.ForeignKey(PEDProeja, on_delete=models.DO_NOTHING, related_name='atividades_proeja')
    atividade = models.ForeignKey(AtividadeProeja, on_delete=models.DO_NOTHING, related_name='dependencias_proeja')
    
    class Meta:
        abstract = False
