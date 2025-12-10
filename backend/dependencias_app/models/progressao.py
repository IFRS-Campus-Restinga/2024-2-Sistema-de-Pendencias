import uuid
from dependencias_app.models.base import *
from django.db import models
from dependencias_app.enums.status_dependencia import *
from dependencias_app.enums.situacao_dependencia import *

class Progressao(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(max_length=50, choices=Status_Dependencia.choices, default='Criada', verbose_name="Status")
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de criação", editable=False)
    data_inicio = models.DateTimeField(null=True, blank=True, verbose_name="Data de início")
    data_final = models.DateTimeField(null=True, blank=True, verbose_name="Data final")
    nota_final = models.FloatField(default=0, verbose_name="Nota")
    situacao = models.CharField(max_length=255, choices=Situacao_Dependencia.choices, default='Em avaliação', verbose_name="Situação")
    observacao = models.TextField(null=True, blank=True, verbose_name="Observação")
    
    class Meta:
        abstract = True

