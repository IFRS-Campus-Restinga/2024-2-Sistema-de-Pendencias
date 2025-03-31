from django.db import models
from .progressao import *
from .turma import *
from .disciplina import *
from .curso import *
from google_auth.models import Usuario

class PPT(Progressao):
    turma_atual = models.ForeignKey(Turma, on_delete=models.DO_NOTHING, related_name='turma_atual_ppt')
    turma_progressao = models.ForeignKey(Turma, on_delete=models.DO_NOTHING, related_name='turma_progressao_ppt')

    # sobrescrita dos related names dos campos chave estrangeira herdados de Dependencia
    aluno = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='ppts_aluno')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='ppts_disciplina')
    curso = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='ppts_curso')
    professor_disciplina = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='ppts_professor_disciplina')
    professor_ppt = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='ppts_professor_resp')

    class Meta:
        abstract = False