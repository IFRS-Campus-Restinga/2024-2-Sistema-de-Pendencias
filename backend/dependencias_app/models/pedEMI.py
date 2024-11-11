from django.db import models
from .dependencia import Dependencia
from google_auth.models import UsuarioBase
from .disciplina import Disciplina
from .curso import Curso
from dependencias_app.enums.trimestreRec import TrimestreRec
from dependencias_app.enums.serieAnoProgressao import SerieAnoProgressao
from .planoEstudos import PlanoEstudos
from .formEncerramento import FormEncerramento

class PED_EMI(Dependencia):
    trimestreRec = models.CharField(null=False, blank=False, choices=TrimestreRec.choices, max_length=10)
    serieAnoProgressao = models.CharField(null=False, blank=False, choices=SerieAnoProgressao.choices, max_length=7)
    plano_estudos = models.ForeignKey(PlanoEstudos, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='plano_estudos_EMI')
    form_encerramento = models.ForeignKey(FormEncerramento, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='form_encerramento_EMI')

    # sobrescrita dos related names dos campos chave estrangeira herdados de Dependencia
    aluno = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='aluno_ped_emi')
    professor = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_ped_emi')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='disciplina_ped_emi')
    curso = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='curso_ped_emi')

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs EMI'