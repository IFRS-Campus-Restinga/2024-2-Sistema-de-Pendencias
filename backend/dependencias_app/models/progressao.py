from dependencias_app.models.base import *
from django.db import models
from dependencias_app.enums.status_dependencia import *
from dependencias_app.enums.situacao_dependencia import *
import uuid


class Progressao(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(max_length=50, choices=Status_Dependencia.choices, default='Criada')
    data_criacao = models.DateField(auto_now_add=True)
    data_inicio = models.DateField(null=True, blank=True)
    data_final = models.DateField(null=True, blank=True)
    nota_final = models.FloatField(default=0)
    situacao = models.CharField(max_length=255, choices=Situacao_Dependencia.choices, default='Em avaliação')
    observacao = models.TextField(null=True, blank=True)
    
    class Meta:
        abstract = True

