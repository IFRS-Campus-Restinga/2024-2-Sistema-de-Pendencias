from django.db import models
from .planoEstudos import PlanoEstudos
from .ped import PED
from .turma import Turma
from dependencias_app.enums.trimestreRec import TrimestreRec
from dependencias_app.enums.serieAnoProgressao import SerieAnoProgressao


class PlanoEstudos_EMI(PlanoEstudos):
    serie_progressao = models.CharField(null=False, blank=False, choices=SerieAnoProgressao.choices, max_length=10)
    trimestre_recuperar = models.CharField(null=False, blank=False, choices=TrimestreRec.choices, max_length=10)
    turma_origem = models.ForeignKey(Turma, on_delete=models.DO_NOTHING, null=False, blank=False)
    ped = models.OneToOneField(PED, on_delete=models.DO_NOTHING, null=False, blank=False, related_name='plano_estudos_EMI')

    class Meta:
        abstract = False