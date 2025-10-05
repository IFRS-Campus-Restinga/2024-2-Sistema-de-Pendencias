import uuid
from django.db import models
from .progressao import Progressao
from dependencias_app.enums.trimestres_rec import Trimestre_Rec
from dependencias_app.enums.serie_progressao import Serie_Progressao
from .custom_user import CustomUser

class PEDIntegrado(Progressao):
    aluno = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="aluno_peds_emi", verbose_name="Aluno", editable=False)
    professor_disciplina = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="disciplina_peds_emi", verbose_name="Professor da disciplina", editable=False)
    disciplina = models.UUIDField(default=uuid.uuid4, verbose_name="Disciplina", editable=False)
    curso = models.UUIDField(default=uuid.uuid4, verbose_name="Curso", editable=False)
    trimestre_recuperar = models.CharField(null=False, blank=False, choices=Trimestre_Rec.choices, max_length=10, verbose_name="Trimestre à recuperar", editable=False)
    serie_progressao = models.CharField(null=False, blank=False, choices=Serie_Progressao.choices, max_length=6, verbose_name="Série da progressão", editable=False)
    turma_atual = models.UUIDField(default=uuid.uuid4, verbose_name="Turma atual", editable=False)
    periodo_letivo = models.UUIDField(default=uuid.uuid4, verbose_name="Período letivo", editable=False)    

    class Meta:
        abstract = False
        verbose_name_plural = 'PEDs EMI'