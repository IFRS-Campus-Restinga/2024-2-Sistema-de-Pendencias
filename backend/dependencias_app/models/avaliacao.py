from .base import BaseModel
from django.db import models
from .atividade import *
from .ped_integrado import PEDIntegrado
from .ped_ProEJA import PEDProEJA
from dependencias_app.enums.status_atividade import Status_Atividade

class AvaliacaoAtividade(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    data_entrega = models.DateField(null=True, blank=True, verbose_name="Data de Entrega")
    data_criacao = models.DateField(auto_now_add=True, verbose_name="Data Criação")
    status = models.CharField(choices=Status_Atividade.choices, max_length=12, default='Não Avaliada', verbose_name="Status")
    nota = models.FloatField(null=True, blank=True, default=None, verbose_name="Nota")

    class Meta:
        abstract = True


class AvaliacaoAtividadeIntegrado(AvaliacaoAtividade):
    ped = models.ForeignKey(PEDIntegrado, on_delete=models.DO_NOTHING, related_name='atividades_emi')
    atividade = models.ForeignKey(AtividadeIntegrado, on_delete=models.DO_NOTHING, related_name='dependencias_emi')

    class Meta:
        abstract = False

class AvaliacaoAtividadeProEJA(AvaliacaoAtividade):
    ped = models.ForeignKey(PEDProEJA, on_delete=models.DO_NOTHING, related_name='atividades_proeja')
    atividade = models.ForeignKey(AtividadeProEJA, on_delete=models.DO_NOTHING, related_name='dependencias_proeja')
    
    class Meta:
        abstract = False
