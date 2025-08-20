from django.db import models
from .base import BaseModel
from .ped_integrado import PEDIntegrado
from .ped_ProEJA import PEDProEJA
import uuid

class ProfessorProgressao(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    professor = models.UUIDField(default=uuid.uuid4, editable=False)
    responsavel_atual = models.BooleanField(default=True)

    class Meta:
        abstract = True


class ProfessorProgressaoIntegrado(ProfessorProgressao):
    ped = models.ForeignKey(PEDIntegrado, on_delete=models.DO_NOTHING, related_name='professores_emi')

    class Meta:
        abstract = False

    
class ProfessorProgressaoProEJA(ProfessorProgressao):
    ped = models.ForeignKey(PEDProEJA, on_delete=models.DO_NOTHING, related_name='professores_proeja')

    class Meta:
        abstract = False