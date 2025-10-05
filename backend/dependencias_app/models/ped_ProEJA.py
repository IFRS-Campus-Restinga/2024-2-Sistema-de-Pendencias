import uuid
from django.db import models
from .progressao import Progressao
from .custom_user import CustomUser

class PEDProEJA(Progressao):
    aluno = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="aluno_peds_proeja", verbose_name="Aluno", editable=False)
    professor_disciplina = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="disciplina_peds_proeja", verbose_name="Professor da disciplina", editable=False)
    disciplina = models.UUIDField(default=uuid.uuid4, verbose_name="Disciplina", editable=False)
    curso = models.UUIDField(default=uuid.uuid4, verbose_name="Curso", editable=False)
    ano_semestre_reprov = models.CharField(null=False, blank=False, max_length=6, verbose_name="Ano/Semestre da reprovação", editable=False)
    periodo_letivo = models.UUIDField(default=uuid.uuid4, verbose_name="Período letivo", editable=False)

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs ProEJA'