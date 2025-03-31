from django.db import models
from .progressao import Progressao
from google_auth.models import Usuario
from .disciplina import Disciplina
from .curso import Curso
from .turma import Turma
from .calendario_academico import Calendario_Academico
from dependencias_app.enums.trimestres_rec import Trimestre_Rec
from dependencias_app.enums.serie_progressao import Serie_Progressao

class PED_EMI(Progressao):
    aluno = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='aluno_ped_emi')
    professor_disciplina = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='professor_disciplina_emi')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='disciplina_ped_emi')
    curso = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='curso_ped_emi')
    trimestre_recuperar = models.CharField(null=False, blank=False, choices=Trimestre_Rec.choices, max_length=10)
    serie_progressao = models.CharField(null=False, blank=False, choices=Serie_Progressao.choices, max_length=6)
    turma_atual = models.ForeignKey(Turma, on_delete=models.DO_NOTHING)
    periodo_letivo = models.ForeignKey(Calendario_Academico, on_delete=models.DO_NOTHING, related_name='periodo_letivo_emi')    

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs EMI'