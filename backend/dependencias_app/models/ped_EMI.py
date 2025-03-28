from django.db import models
from .progressao import Progressao
from google_auth.models import UsuarioBase
from .disciplina import Disciplina
from .curso import Curso
from .turma import Turma
from .calendario_academico import Calendario_Academico
from dependencias_app.enums.trimestreRec import TrimestreRec
from dependencias_app.enums.serieProgressao import SerieProgressao

class PED_EMI(Progressao):
    aluno = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='aluno_ped_emi')
    professor_disciplina = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_disciplina_emi')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='disciplina_ped_emi')
    curso = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='curso_ped_emi')
    trimestre_recuperar = models.CharField(null=False, blank=False, choices=TrimestreRec.choices, max_length=10)
    serie_progressao = models.CharField(null=False, blank=False, choices=SerieProgressao.choices, max_length=6)
    turma_atual = models.ForeignKey(Turma, on_delete=models.DO_NOTHING)
    periodo_letivo = models.ForeignKey(Calendario_Academico, on_delete=models.DO_NOTHING, related_name='periodo_letivo_emi')    

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs EMI'