from django.db import models
from .base import BaseModel
from .pedEMI import PED_EMI
from .pedProEJA import PED_ProEJA
from dependencias_app.models.dependencia import *
from dependencias_app.enums.formaOferta import FormaOferta
from dependencias_app.enums.turnos import Turnos

class PlanoEstudos(BaseModel):
    campus = models.CharField(default='Restinga', help_text="Informe o campus", max_length=20, null=False, blank=False)
    forma_oferta = models.CharField(help_text="Selecione a forma de oferta", choices=FormaOferta.choices, max_length=20, null=False, blank=False)
    turno = models.CharField(help_text="Selecione o turno", choices=Turnos, max_length=10, null=False, blank=False)
    parecer_pedagogico = models.TextField(help_text="Informe o parecer pedagógico",blank=False, null=False)
    aprovado = models.BooleanField(default=False)


    class Meta:
        abstract = True
        verbose_name_plural = 'Planos de Estudos'

class PlanoEstudos_EMI(PlanoEstudos):
    ped = models.OneToOneField(PED_ProEJA, on_delete=models.DO_NOTHING, related_name='plano_estudos_emi')

    class Meta:
        abstract = False

class PlanoEstudos_ProEJA(PlanoEstudos):
    ped = models.OneToOneField(PED_ProEJA, on_delete=models.DO_NOTHING, related_name='plano_estudos_proeja')

    class Meta:
        abstract = False