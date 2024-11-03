from dependencias_app.models.base import *
from django.db import models
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.aluno import Aluno
from dependencias_app.models.professor import Professor
from dependencias_app.enums.DependenciaStatus import STATUS_DEPENDENCIA

class Dependencia(BaseModel):
    # Precisa relacionar com as respectivas tabelas quando implementado.
    alunoEmail= models.EmailField(max_length=255)
    disciplinaId = models.CharField(max_length=2)
    professorId = models.CharField(max_length=2)

    status = models.CharField(max_length=50, choices=STATUS_DEPENDENCIA, default='criada')
    dataInicio = models.DateField()
    dataFim = models.DateField()
    notaFinal = models.FloatField(null=True, blank=True)
    situacao = models.CharField(max_length=255)
    observacao = models.TextField(blank=True)

    curso = models.CharField(max_length=255)

    class Meta:
        abstract = True