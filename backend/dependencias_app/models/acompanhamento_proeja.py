from django.db import models
from .ped_proeja import PEDProEJA
from .acompanhamento import Acompanhamento

class AcompanhamentoProEJA(Acompanhamento):
    ped = models.ForeignKey(PEDProEJA, on_delete=models.CASCADE, related_name='acompanhamento_proeja')
