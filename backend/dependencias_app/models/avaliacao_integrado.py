from django.db import models
from .avaliacao import Avaliacao
from .ped_integrado import PEDIntegrado
from .atividade_integrado import AtividadeIntegrado

class AvaliacaoIntegrado(Avaliacao):
    ped = models.ForeignKey(PEDIntegrado, on_delete=models.DO_NOTHING, related_name='atividades_emi')
    atividade = models.ForeignKey(AtividadeIntegrado, on_delete=models.DO_NOTHING, related_name='dependencias_emi')

    class Meta:
        abstract = False
        verbose_name = "Avaliações EMI"
