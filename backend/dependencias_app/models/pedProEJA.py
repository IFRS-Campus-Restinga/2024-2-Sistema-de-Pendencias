from django.db import models
from .dependencia import Dependencia
from google_auth.models import UsuarioBase
from .disciplina import Disciplina
from .curso import Curso
from .planoEstudos import PlanoEstudos
from .formEncerramento import FormEncerramento


class PED_ProEJA(Dependencia):
    aluno = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='aluno_ped_proeja')
    professor_ped_proeja = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_ped_proeja')
    professor_disciplina_proeja = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_disciplina_proeja')
    disciplina_proeja = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='disciplina_ped_proeja')
    curso_proeja = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='curso_ped_proeja')
    ano_semestre_reprov = models.CharField(null=False, blank=False, max_length=6)
    plano_estudos_proeja = models.OneToOneField(PlanoEstudos, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='plano_estudos_emi')
    form_encerramento_proeja = models.OneToOneField(FormEncerramento, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='form_encerramento_proeja')

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs ProEJA'