from django.db import models
from .base import BaseModel
from .ped_integrado import PEDIntegrado
from .ped_ProEJA import PEDProEJA
from dependencias_app.models.progressao import *
from dependencias_app.enums.forma_oferta import Forma_Oferta
from dependencias_app.enums.turnos import Turnos

class Plano_Estudos(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campus = models.CharField(default='Restinga', max_length=20, null=False, blank=False, verbose_name="Campus")
    forma_oferta = models.CharField(choices=Forma_Oferta.choices, max_length=20, null=False, blank=False, verbose_name="Forma de oferta")
    turno = models.CharField(choices=Turnos.choices, max_length=10, null=False, blank=False, verbose_name="Turno")
    parecer_pedagogico = models.TextField(blank=False, null=False, verbose_name="Parecer pedagógico")

    class Meta:
        abstract = True
        verbose_name_plural = 'Planos de Estudos'

class Plano_Estudos_EMI(Plano_Estudos):
    ped = models.OneToOneField(PEDIntegrado, on_delete=models.DO_NOTHING, related_name='plano_estudos_emi')

    class Meta:
        abstract = False

class Plano_Estudos_ProEJA(Plano_Estudos):
    ped = models.OneToOneField(PEDProEJA, on_delete=models.DO_NOTHING, related_name='plano_estudos_proeja')

    class Meta:
        abstract = False