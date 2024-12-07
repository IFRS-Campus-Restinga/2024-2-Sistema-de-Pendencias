from django.db import models
from .dependencia import Dependencia
from .calendarioAcademico import CalendarioAcademico
from .disciplina import Disciplina
from .curso import Curso
from google_auth.models import UsuarioBase
from .planoEstudos import PlanoEstudos
from .formEncerramento import FormEncerramento
from django.core.validators import FileExtensionValidator

class PED_ProEJA(Dependencia):
    aluno = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='aluno_ped_proeja')
    professor_ped = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_ped_proeja')
    professor_disciplina = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_disciplina_proeja')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='disciplina_ped_proeja')
    curso = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='curso_ped_proeja')
    ano_semestre_reprov = models.CharField(null=False, blank=False, max_length=6)
    periodo_letivo = models.ForeignKey(CalendarioAcademico, on_delete=models.DO_NOTHING, related_name='periodo_letivo_proeja')
    plano_estudos = models.ForeignKey(PlanoEstudos, blank=True, null=True, on_delete=models.DO_NOTHING, related_name='dependencia_proeja')
    form_encerramento = models.ForeignKey(FormEncerramento, blank=True, null=True, on_delete=models.DO_NOTHING, related_name='form_encerramento_PROEJA')
    plano_atividades = models.FileField(upload_to='plano_atividades/', null=True, blank=True, validators=[FileExtensionValidator(allowed_extensions=['pdf'])])
     # sobrescrita dos related names dos campos chave estrangeira herdados de Dependencia

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs ProEJA'