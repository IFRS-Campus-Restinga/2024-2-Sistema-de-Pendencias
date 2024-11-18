from django.db import models
from .base import BaseModel
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from django.core.validators import MinLengthValidator

class Atividade(BaseModel):
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], verbose_name="Título", help_text="Informe o título da atividade", blank=False, null=False)
    descricao = models.TextField(verbose_name="Descrição", help_text="Informe a descrição da atividade", blank=False, null=False)
    nota = models.FloatField(default=0)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_de_entrega = models.DateField()

    class Meta:
        abstract = True

class Atividade_EMI(Atividade):
    ped_emi = models.ForeignKey(PED_EMI, on_delete=models.DO_NOTHING, related_name='atividades_emi')
    
    class Meta:
        verbose_name_plural = 'Atividades EMI'

class Atividade_ProEJA(Atividade):
    ped_proeja = models.ForeignKey(PED_ProEJA, on_delete=models.DO_NOTHING, related_name='atividades_proeja')

    class Meta:
        verbose_name_plural = 'Atividades ProEJA'
