from django.db import models
from .base import BaseModel
from django.core.validators import MinLengthValidator
from dependencias_app.models.base import *
from django.db import models
from dependencias_app.enums.statusDependencia import *

class Observacao(BaseModel):
    data_insercao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Inserção")
    parecer = models.TextField(verbose_name="Parecer", help_text="Informe o parecer da observação", blank=False, null=False)
    status = models.CharField(max_length=50, choices=StatusDependencia.choices)

    class Meta:
        verbose_name_plural = "Observações"
