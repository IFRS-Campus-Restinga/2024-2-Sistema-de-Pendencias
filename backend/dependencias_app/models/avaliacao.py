from .base import BaseModel
from django.db import models
from .atividade import *
from .pedEMI import PED_EMI
from .pedProEJA import PED_ProEJA
from dependencias_app.enums.statusAtividade import StatusAtividade

class Avaliacao_Atividade(BaseModel):
    data_entrega = models.DateField(null=True, blank=True)
    data_criacao = models.DateField(auto_now_add=True)
    status = models.CharField(choices=StatusAtividade.choices, max_length=12, default='Não Avaliada')
    nota = models.FloatField(null=True, blank=True, default=None)

    class Meta:
        abstract = True


class Avaliacao_Atividade_EMI(Avaliacao_Atividade):
    ped = models.ForeignKey(PED_EMI, on_delete=models.DO_NOTHING, related_name='atividades_emi')
    atividade = models.ForeignKey(Atividade_EMI, on_delete=models.DO_NOTHING, related_name='dependencias_emi')

    class Meta:
        abstract = False

class Avaliacao_Atividade_ProEJA(Avaliacao_Atividade):
    ped = models.ForeignKey(PED_ProEJA, on_delete=models.DO_NOTHING, related_name='atividades_proeja')
    atividade = models.ForeignKey(Atividade_ProEJA, on_delete=models.DO_NOTHING, related_name='dependencias_proeja')
    
    class Meta:
        abstract = False
