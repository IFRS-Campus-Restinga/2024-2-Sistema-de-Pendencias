import uuid
from django.db import models
from .progressao import Progressao

class PEDProEJA(Progressao):
    aluno = models.UUIDField(default=uuid.uuid4, editable=False)
    professor_disciplina = models.UUIDField(default=uuid.uuid4, editable=False)
    disciplina = models.UUIDField(default=uuid.uuid4, editable=False)
    curso = models.UUIDField(default=uuid.uuid4, editable=False)
    ano_semestre_reprov = models.CharField(null=False, blank=False, max_length=6)
    periodo_letivo = models.UUIDField(default=uuid.uuid4, editable=False)

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs ProEJA'