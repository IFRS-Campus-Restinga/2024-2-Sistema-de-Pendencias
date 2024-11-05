from django.db import models
from .base import BaseModel
from dependencias_app.enums.formaOferta import FormaOferta
from dependencias_app.enums.turnos import Turnos


class PlanoEstudos(BaseModel):
    campus = models.CharField(null=False, blank=False, default='Restinga', max_length=20)
    formaOferta = models.CharField(null=False, blank=False, choices=FormaOferta.choices, max_length=15)
    turno = models.CharField(null=False, blank=False, choices=Turnos.choices, max_length=10)
    semestre_ano = models.CharField(null=False, blank=False, max_length=5)
    parecer_pedagogico = models.TextField(blank=False, null=False, max_length=500)

    class Meta:
        abstract = False