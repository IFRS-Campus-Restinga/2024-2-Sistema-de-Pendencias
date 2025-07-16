from django.db import models
from .progressao import *

class PPT(Progressao):
    turma_atual = models.UUIDField(default=uuid.uuid4, editable=False)
    turma_progressao = models.UUIDField(default=uuid.uuid4, editable=False)

    # sobrescrita dos related names dos campos chave estrangeira herdados de Dependencia
    aluno = models.UUIDField(default=uuid.uuid4, editable=False)
    disciplina = models.UUIDField(default=uuid.uuid4, editable=False)
    curso = models.UUIDField(default=uuid.uuid4, editable=False)
    professor_disciplina = models.UUIDField(default=uuid.uuid4, editable=False)
    professor_ppt = models.UUIDField(default=uuid.uuid4, editable=False)

    class Meta:
        abstract = False