from django.db import models
from .base import BaseModel
from dependencias_app.models.dependencia import *
from dependencias_app.enums.formaOferta import FormaOferta
from dependencias_app.enums.turnos import Turnos

class PlanoEstudos(BaseModel):
    campus = models.CharField(default='Restinga', help_text="Informe o campus", max_length=20, null=False, blank=False)
    ano_progressao = models.CharField(null=False, blank=False, max_length=4)
    forma_oferta = models.CharField(help_text="Selecione a forma de oferta", choices=FormaOferta.choices, max_length=20, null=False, blank=False)
    turno = models.CharField(help_text="Selecione o turno", choices=Turnos, max_length=10, null=False, blank=False)
    parecer_pedagogico = models.TextField(help_text="Informe o parecer pedagógico",blank=False, null=False, max_length=500)


    class Meta:
        abstract = False
        verbose_name_plural = 'Planos de Estudos'