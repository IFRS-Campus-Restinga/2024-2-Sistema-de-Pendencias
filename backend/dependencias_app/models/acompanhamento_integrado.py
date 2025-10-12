from django.db import models
from .ped_integrado import PEDIntegrado
from .acompanhamento import Acompanhamento

class AcompanhamentoIntegrado(Acompanhamento):
    ped = models.ForeignKey(PEDIntegrado, on_delete=models.CASCADE, related_name='acompanhamento_emi')