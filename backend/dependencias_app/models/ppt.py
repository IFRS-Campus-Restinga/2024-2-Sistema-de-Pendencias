from django.db import models
from .dependencia import *
from .turma import *
from .disciplina import *
from .curso import *
from google_auth.models import UsuarioBase

class PPT(Dependencia):
    turma_atual = models.ForeignKey(Turma, on_delete=models.DO_NOTHING, related_name='turma_atual')
    turma_progressao = models.ForeignKey(Turma, on_delete=models.DO_NOTHING, related_name='turma_progressao')

    # sobrescrita dos related names dos campos chave estrangeira herdados de Dependencia
    aluno = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='aluno_ppt')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='disciplina_ppt')
    curso = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='curso_ppt')
    professor_disciplina = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_disciplina')
    professor_ppt = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_ppt')

    class Meta:
        abstract = False