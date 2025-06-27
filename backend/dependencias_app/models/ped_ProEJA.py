from django.db import models
from .progressao import Progressao
from .calendario_academico import Calendario_Academico
from .disciplina import Disciplina
from .curso import Curso
from google_auth.models import Usuario

class PED_ProEJA(Progressao):
    aluno = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='peds_proeja')
    professor_disciplina = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='peds_proeja_prof_disciplina')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='peds_proeja_discplina')
    curso = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='peds_proeja_curso')
    ano_semestre_reprov = models.CharField(null=False, blank=False, max_length=6)
    periodo_letivo = models.ForeignKey(Calendario_Academico, on_delete=models.DO_NOTHING, related_name='peds_proeja_periodo_letivo')

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs ProEJA'