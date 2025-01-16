from django.db import models
from .base import BaseModel
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from django.core.validators import MinLengthValidator

class Atividade(BaseModel):
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], verbose_name="Título", help_text="Informe o título da atividade", blank=False, null=False)
    descricao = models.TextField(verbose_name="Descrição", help_text="Informe a descrição da atividade", blank=False, null=False)
    nota = models.FloatField(default=0, null=True, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_de_entrega = models.DateField()
    observacoes = models.TextField(max_length=255, null=True, blank=True)
    url_PDF = models.URLField(max_length=255, null=True, blank=True)

    class Meta:
        abstract = True

class Atividade_EMI(Atividade):
    ped_emi = models.ManyToManyField(PED_EMI, related_name='atividades_emi')
    
    class Meta:
        abstract = False
        verbose_name_plural = 'Atividades EMI'

class Atividade_ProEJA(Atividade):
    ped_proeja = models.ManyToManyField(PED_ProEJA, related_name='atividades_proeja')

    class Meta:
        abstract = False
        verbose_name_plural = 'Atividades ProEJA'
