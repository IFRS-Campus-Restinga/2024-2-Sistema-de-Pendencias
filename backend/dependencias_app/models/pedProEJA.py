from .dependencia import Dependencia
from .disciplina import Disciplina
from .curso import Curso
from google_auth.models import UsuarioBase
from django.db import models
from .planoEstudos import PlanoEstudos
from .formEncerramento import FormEncerramento

class PED_ProEJA(Dependencia):
    anoSemestreReprov = models.CharField(null=False, blank=False, max_length=6)
    plano_estudos = models.ForeignKey(PlanoEstudos, blank=True, null=True, on_delete=models.DO_NOTHING, related_name='plano_estudos_PROEJA')
    form_encerramento = models.ForeignKey(PlanoEstudos, blank=True, null=True, on_delete=models.DO_NOTHING, related_name='form_encerramento_PROEJA')

     # sobrescrita dos related names dos campos chave estrangeira herdados de Dependencia
    aluno = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='aluno_ped_proeja')
    professor = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_ped_proeja')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='disciplina_ped_proeja')
    curso = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='curso_ped_proeja')

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs PROEJA'