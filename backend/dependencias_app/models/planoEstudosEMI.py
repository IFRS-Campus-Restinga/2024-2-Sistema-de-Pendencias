from django.db import models
from .planoEstudos import PlanoEstudos
from dependencias_app.enums.trimestreRec import TrimestreRec
from dependencias_app.models.ped import PED
from dependencias_app.enums.serieAnoProgressao import SerieAnoProgressao


class PlanoEstudos_EMI(PlanoEstudos):
    serie_progressao = models.CharField(null=False, blank=False, choices=SerieAnoProgressao.choices, max_length=10)
    trimestre_recuperar = models.CharField(null=False, blank=False, choices=TrimestreRec.choices, max_length=10)
    ped = models.ForeignKey(PED, on_delete=models.DO_NOTHING, null=False, blank=False)

    class Meta:
        abstract = False