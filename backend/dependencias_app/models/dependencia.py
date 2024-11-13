from dependencias_app.models.base import *
from django.db import models
from dependencias_app.enums.statusDependencia import *
from dependencias_app.enums.situacaoDependencia import *

class Dependencia(BaseModel):
    status = models.CharField(max_length=50, choices=StatusDependencia.choices, default='Criada')
    data_criacao = models.DateField(auto_now_add=True)
    data_inicio = models.DateField(null=True, blank=True)
    data_final = models.DateField(null=True, blank=True)
    nota_final = models.FloatField(default=0)
    situacao = models.CharField(max_length=255, choices=SituacaoDependencia.choices, default='Em avaliação')
    observacao = models.TextField(null=True, blank=True)

    class Meta:
        abstract = True

