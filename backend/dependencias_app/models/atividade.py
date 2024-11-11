from django.db import models
from .base import BaseModel
from dependencias_app.models.dependencia import *
from django.core.validators import MinLengthValidator
from .pedEMI import PED_EMI
from .pedProEJA import PED_ProEJA

class Atividade(BaseModel):
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], verbose_name="Título", help_text="Informe o título da atividade", blank=False, null=False)
    descricao = models.TextField(verbose_name="Descrição", help_text="Informe a descrição da atividade", blank=False, null=False)
    nota = models.FloatField(default=0)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_de_entrega = models.DateField()

    class Meta:
        abstract = True

# Modelo para atividades associadas ao PED_EMI
class AtividadePED_EMI(Atividade):
    ped_emi = models.ForeignKey(PED_EMI, on_delete=models.DO_NOTHING, related_name='atividades_emi', null=True, blank=True)

    class Meta:
        verbose_name = 'Atividade PED EMI'
        verbose_name_plural = 'Atividades PED EMI'

# Modelo para atividades associadas ao PED_ProEJA
class AtividadePED_ProEJA(Atividade):
    ped_proeja = models.ForeignKey(PED_ProEJA, on_delete=models.DO_NOTHING, related_name='atividades_proeja', null=True, blank=True)

    class Meta:
        verbose_name = 'Atividade PED ProEJA'
        verbose_name_plural = 'Atividades PED ProEJA'