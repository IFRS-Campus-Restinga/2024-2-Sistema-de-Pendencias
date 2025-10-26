from django.db import models
from .progressao import *
from .usuario import Usuario
from django.utils.translation import gettext_lazy as _

class PPT(Progressao):
    turma_atual = models.UUIDField(default=uuid.uuid4, verbose_name="Turma atual", editable=False)
    turma_progressao = models.UUIDField(default=uuid.uuid4, verbose_name="Turma da progressãao", editable=False)

    # sobrescrita dos related names dos campos chave estrangeira herdados de Dependencia
    aluno = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="ppts_aluno", verbose_name="Aluno", editable=False)
    professor_disciplina = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="ppts_disciplina_professor", verbose_name="Professor da disciplina", editable=False)
    professor_ppt = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="ppts_professor", verbose_name="Professor da progressão", editable=False)
    disciplina = models.UUIDField(default=uuid.uuid4, verbose_name="Disciplina", editable=False)
    curso = models.UUIDField(default=uuid.uuid4, verbose_name="Curso", editable=False)

    class Meta:
        abstract = False
