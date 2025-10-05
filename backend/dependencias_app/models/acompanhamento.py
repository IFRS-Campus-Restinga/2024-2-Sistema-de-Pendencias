import uuid
from django.db import models
from .base import BaseModel
from dependencias_app.models.base import *
from django.db import models
from dependencias_app.enums.status_dependencia import *
from dependencias_app.models.ped_integrado import PEDIntegrado
from dependencias_app.models.ped_ProEJA import PEDProEJA

class Acompanhamento(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    parecer = models.TextField(blank=False, null=False, verbose_name="Parecer")
    status = models.CharField(max_length=50, choices=Status_Dependencia.choices, verbose_name="Status")

    class Meta:
        abstract = True
        verbose_name_plural = "Observações"

class AcompanhamentoIntegrado(Acompanhamento):
    ped = models.ForeignKey(PEDIntegrado, on_delete=models.CASCADE, related_name='acompanhamento_emi', verbose_name="PED EMI")

class AcompanhamentoProEJA(Acompanhamento):
    ped = models.ForeignKey(PEDProEJA, on_delete=models.CASCADE, related_name='acompanhamento_proeja', verbose_name="PED ProEJA")
