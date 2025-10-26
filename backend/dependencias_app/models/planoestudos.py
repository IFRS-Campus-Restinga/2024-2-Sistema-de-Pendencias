import uuid
from django.db import models
from .base import BaseModel
from dependencias_app.enums.forma_oferta import Forma_Oferta
from dependencias_app.enums.turnos import Turnos

class PlanoEstudos(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campus = models.CharField(default='Restinga', max_length=20, null=False, blank=False, verbose_name="Campus")
    forma_oferta = models.CharField(choices=Forma_Oferta.choices, max_length=20, null=False, blank=False, verbose_name="Forma de oferta")
    turno = models.CharField(choices=Turnos.choices, max_length=10, null=False, blank=False, verbose_name="Turno")
    parecer_pedagogico = models.TextField(blank=False, null=False, verbose_name="Parecer pedagógico")
    drive_id = models.CharField(blank=False, null=False)

    class Meta:
        abstract = True
        verbose_name_plural = 'Planos de Estudos'