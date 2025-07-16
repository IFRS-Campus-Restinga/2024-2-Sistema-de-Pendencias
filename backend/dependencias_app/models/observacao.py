from django.db import models
from .base import BaseModel
from dependencias_app.models.base import *
from django.db import models
from dependencias_app.enums.status_dependencia import *

class Observacao(BaseModel):
    data_criacao = models.DateTimeField(auto_now_add=True)
    parecer = models.TextField(blank=False, null=False)
    status = models.CharField(max_length=50, choices=Status_Dependencia.choices)

    class Meta:
        verbose_name_plural = "Observações"
