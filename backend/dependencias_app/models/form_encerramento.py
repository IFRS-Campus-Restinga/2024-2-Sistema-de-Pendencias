import uuid
from django.db import models
from .base import BaseModel
from .ped_integrado import PEDIntegrado
from .ped_ProEJA import PEDProEJA

class FormEncerramento(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parecerFinal = models.TextField(null=False, blank=False, max_length=500)

    class Meta:
        abstract = True

class FormEncerramentoIntegrado(FormEncerramento):
    ped = models.OneToOneField(PEDIntegrado, on_delete=models.DO_NOTHING, related_name='form_encerramento_emi')

    class Meta:
        abstract = False

class FormEncerramentoProEJA(FormEncerramento):
    ped = models.OneToOneField(PEDProEJA, on_delete=models.DO_NOTHING, related_name='form_encerramento_proeja')

    class Meta:
        abstract = False
    