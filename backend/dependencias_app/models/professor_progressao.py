from django.db import models
from .base import BaseModel
from .ped_EMI import PED_EMI
from ped_ProEJA import PED_ProEJA
from google_auth.models import UsuarioBase

class Professor_Progressao(BaseModel):
    professor = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professores')
    responsavel_atual = models.BooleanField(default=True)


class Professor_Progressao_EMI(Professor_Progressao):
    ped_emi = models.ForeignKey(PED_EMI, on_delete=models.DO_NOTHING, related_name='progressoes_emi')

    class Meta:
        abstract = False

    
class Professor_Progressao_ProEJA(Professor_Progressao):
    ped_emi = models.ForeignKey(PED_ProEJA, on_delete=models.DO_NOTHING, related_name='progressoes_proeja')

    class Meta:
        abstract = False