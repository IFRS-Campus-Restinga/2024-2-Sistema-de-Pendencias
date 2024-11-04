from django.db import models
from dependencias_app.models.dependencia import *
from dependencias_app.models.turma import *

class PPT(Dependencia):
    turmaOrigem = models.ForeignKey(Turma, on_delete=models.DO_NOTHING, related_name='Origem')
    turmaProgressao = models.ForeignKey(Turma, on_delete=models.DO_NOTHING, related_name='Progressão')

    class Meta:
        abstract = False
