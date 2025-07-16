from django.db import models
from .base import BaseModel
from .ped_EMI import PED_EMI
from .ped_ProEJA import PED_ProEJA
import uuid

class Professor_Progressao(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    professor = models.UUIDField(default=uuid.uuid4, editable=False)
    responsavel_atual = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Professor_Progressao_EMI(Professor_Progressao):
    ped = models.ForeignKey(PED_EMI, on_delete=models.DO_NOTHING, related_name='professores_emi')

    class Meta:
        abstract = False

    
class Professor_Progressao_ProEJA(Professor_Progressao):
    ped = models.ForeignKey(PED_ProEJA, on_delete=models.DO_NOTHING, related_name='professores_proeja')

    class Meta:
        abstract = False