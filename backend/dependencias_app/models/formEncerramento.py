from django.db import models
from .base import BaseModel
from .pedEMI import PED_EMI
from .pedEMI import PED_EMI

class FormEncerramento(BaseModel):
    parecerFinal = models.TextField(null=False, blank=False, max_length=500)

    class Meta:
        abstract = True

class FormEncerramento_EMI(FormEncerramento):
    ped_emi = models.ForeignKey(PED_EMI, on_delete=models.DO_NOTHING, related_name='form_encerramento_emi')

    class Meta:
        abstract = False

class FormEncerramento_ProEJA(FormEncerramento):
    ped_proeja = models.ForeignKey(PED_EMI, on_delete=models.DO_NOTHING, related_name='form_encerramento_proeja')

    class Meta:
        abstract = False
    