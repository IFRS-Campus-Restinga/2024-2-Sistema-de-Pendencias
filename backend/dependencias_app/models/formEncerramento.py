from django.db import models
from .base import BaseModel
from .ped import PED

class FormEncerramento(BaseModel):
    parecerFinal = models.TextField(null=False, blank=False, max_length=500)
    ped = models.ForeignKey(PED, on_delete=models.DO_NOTHING, null=False, blank=False)

    class Meta:
        abstract = False
    