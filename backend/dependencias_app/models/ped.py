from django.db import models
from .dependencia import Dependencia
from google_auth.models import UsuarioBase
from .disciplina import Disciplina
from .curso import Curso
from dependencias_app.enums.modalidade import Modalidade

class PED(Dependencia):
    # sobrescrita dos related names dos campos chave estrangeira herdados de Dependencia
    aluno = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='aluno_ped_emi')
    professor = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_ped_emi')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='disciplina_ped_emi')
    curso = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='curso_ped_emi')
    modalidade = models.CharField(null=False, blank=False, choices=Modalidade.choices, max_length=10)

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs'