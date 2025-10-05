from django.db import models
from .base import BaseModel
from .ped_integrado import PEDIntegrado
from .ped_ProEJA import PEDProEJA
from .custom_user import CustomUser
import uuid

class ProfessorProgressao(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    responsavel_atual = models.BooleanField(default=True)

    class Meta:
        abstract = True


class ProfessorProgressaoIntegrado(ProfessorProgressao):
    ped = models.ForeignKey(PEDIntegrado, on_delete=models.DO_NOTHING, related_name='professores_emi')
    professor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='professor_peds_emi')

    class Meta:
        abstract = False

    
class ProfessorProgressaoProEJA(ProfessorProgressao):
    ped = models.ForeignKey(PEDProEJA, on_delete=models.DO_NOTHING, related_name='professores_proeja')
    professor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='professor_peds_proeja')

    class Meta:
        abstract = False