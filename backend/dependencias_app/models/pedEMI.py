from django.db import models
from .dependencia import Dependencia
from google_auth.models import UsuarioBase
from .disciplina import Disciplina
from .curso import Curso
from .turma import Turma
from .formEncerramento import FormEncerramento
from .planoEstudos import PlanoEstudos
from dependencias_app.enums.trimestreRec import TrimestreRec
from dependencias_app.enums.serieProgressao import SerieProgressao

class PED_EMI(Dependencia):
    aluno_emi = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='aluno_ped_emi')
    professor_ped_emi = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_ped_emi')
    professor_disciplina_emi = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_disciplina_emi')
    disciplina_emi = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='disciplina_ped_emi')
    curso_emi = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='curso_ped_emi')
    trimestre_recuperar = models.CharField(null=False, blank=False, choices=TrimestreRec.choices, max_length=10)
    serie_progressao = models.CharField(null=False, blank=False, choices=SerieProgressao.choices, max_length=6)
    turma_origem = models.ForeignKey(Turma, on_delete=models.DO_NOTHING)
    plano_estudos_emi = models.OneToOneField(PlanoEstudos, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='plano_estudos_proeja')
    form_encerramento_emi = models.OneToOneField(FormEncerramento, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='form_encerramento_emi')

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs EMI'