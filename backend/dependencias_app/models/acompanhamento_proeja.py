from django.db import models
from .ped_proeja import PEDProeja
from .acompanhamento import Acompanhamento

class AcompanhamentoProeja(Acompanhamento):
    ped = models.ForeignKey(PEDProeja, on_delete=models.CASCADE, related_name='acompanhamento_proeja')