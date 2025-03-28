from django.db import models
from .base import BaseModel
from .ped_EMI import PED_EMI
from .ped_ProEJA import PED_ProEJA

class Form_Encerramento(BaseModel):
    parecerFinal = models.TextField(null=False, blank=False, max_length=500)

    class Meta:
        abstract = True

class Form_Encerramento_EMI(Form_Encerramento):
    ped = models.ForeignKey(PED_EMI, on_delete=models.DO_NOTHING, related_name='form_encerramento_emi')

    class Meta:
        abstract = False

class Form_Encerramento_ProEJA(Form_Encerramento):
    ped = models.ForeignKey(PED_ProEJA, on_delete=models.DO_NOTHING, related_name='form_encerramento_proeja')

    class Meta:
        abstract = False
    