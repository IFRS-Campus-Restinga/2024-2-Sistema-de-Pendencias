from django.db import models
from .base import BaseModel
from .ped_EMI import PED_EMI
from .ped_ProEJA import PED_ProEJA
from dependencias_app.models.progressao import *
from dependencias_app.enums.forma_oferta import Forma_Oferta
from dependencias_app.enums.turnos import Turnos

class Plano_Estudos(BaseModel):
    campus = models.CharField(default='Restinga', max_length=20, null=False, blank=False)
    forma_oferta = models.CharField(choices=Forma_Oferta.choices, max_length=20, null=False, blank=False)
    turno = models.CharField(choices=Turnos.choices, max_length=10, null=False, blank=False)
    parecer_pedagogico = models.TextField(blank=False, null=False)
    aprovado = models.BooleanField(default=False)


    class Meta:
        abstract = True
        verbose_name_plural = 'Planos de Estudos'

class Plano_Estudos_EMI(Plano_Estudos):
    ped = models.OneToOneField(PED_EMI, on_delete=models.DO_NOTHING, related_name='plano_estudos_emi')

    class Meta:
        abstract = False

class Plano_Estudos_ProEJA(Plano_Estudos):
    ped = models.OneToOneField(PED_ProEJA, on_delete=models.DO_NOTHING, related_name='plano_estudos_proeja')

    class Meta:
        abstract = False