from django.db import models
from dependencias_app.models.dependencia import *
from dependencias_app.models.turma import *

class PPT(Dependencia):
    turmaOrigem = models.ForeignKey(Turma, on_delete=models.DO_NOTHING, related_name='turma_origem')
    turmaProgressao = models.ForeignKey(Turma, on_delete=models.DO_NOTHING, related_name='turma_progressao')

    # sobrescrita dos related names dos campos chave estrangeira herdados de Dependencia
    aluno = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='aluno_ppt')
    professor = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='professor_ppt')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='disciplina_ppt')
    curso = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='curso_ppt')

    class Meta:
        abstract = False
