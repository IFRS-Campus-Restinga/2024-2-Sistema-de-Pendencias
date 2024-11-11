from django.db import models
from .planoEstudos import PlanoEstudos
from dependencias_app.models.ped import PED


class PlanoEstudos_ProEJA(PlanoEstudos):
    anoSemestreReprov = models.CharField(null=False, blank=False, max_length=6)
    ped = models.ForeignKey(PED, on_delete=models.DO_NOTHING, null=False, blank=False)

    class Meta:
        abstract = False