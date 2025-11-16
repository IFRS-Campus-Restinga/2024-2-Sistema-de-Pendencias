import uuid
from django.db import models
from .base import BaseModel
from dependencias_app.models.base import BaseModel
from dependencias_app.enums.gravidade_acompanhamento import GravidadeAcompanhamnto

class Acompanhamento(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    parecer = models.TextField(blank=False, null=False, verbose_name="Parecer")
    status = models.CharField(max_length=50, choices=GravidadeAcompanhamnto.choices, verbose_name="Status")

    class Meta:
        abstract = True
        verbose_name_plural = "Acompanhamentos"
