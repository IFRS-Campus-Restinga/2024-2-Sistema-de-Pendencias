import uuid
from django.db import models
from .progressao import Progressao
from dependencias_app.enums.trimestres_rec import Trimestre_Rec
from dependencias_app.enums.serie_progressao import Serie_Progressao

class PED_EMI(Progressao):
    aluno = models.UUIDField(default=uuid.uuid4, editable=False)
    professor_disciplina = models.UUIDField(default=uuid.uuid4, editable=False)
    disciplina = models.UUIDField(default=uuid.uuid4, editable=False)
    curso = models.UUIDField(default=uuid.uuid4, editable=False)
    trimestre_recuperar = models.CharField(null=False, blank=False, choices=Trimestre_Rec.choices, max_length=10)
    serie_progressao = models.CharField(null=False, blank=False, choices=Serie_Progressao.choices, max_length=6)
    turma_atual = models.UUIDField(default=uuid.uuid4, editable=False)
    periodo_letivo = models.UUIDField(default=uuid.uuid4, editable=False)    

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs EMI'