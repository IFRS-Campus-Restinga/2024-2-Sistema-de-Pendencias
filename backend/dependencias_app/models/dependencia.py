from dependencias_app.models.base import *
from django.db import models
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.curso import Curso
from dependencias_app.enums.statusDependencia import *
from dependencias_app.enums.situacaoDependencia import *
from google_auth.models import UsuarioBase

class Dependencia(BaseModel):
    aluno = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING)
    curso = models.ForeignKey(Curso, on_delete=models.DO_NOTHING)
    status = models.CharField(max_length=50, choices=StatusDependencia.choices, default='Criada')
    dataInicio = models.DateField()
    dataFim = models.DateField(null=True, blank=True)
    notaFinal = models.FloatField(default=0)
    situacao = models.CharField(max_length=255, choices=SituacaoDependencia.choices, default='Em avaliação')
    observacao = models.TextField(null=True, blank=True)

    class Meta:
        abstract = True

