from django.db import models
from .base import BaseModel
from dependencias_app.models.ped import PED
from django.core.validators import MinLengthValidator

class Atividade(BaseModel):
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], verbose_name="Título", help_text="Informe o título da atividade", blank=False, null=False)
    descricao = models.TextField(verbose_name="Descrição", help_text="Informe a descrição da atividade", blank=False, null=False)
    nota = models.FloatField(default=0)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_de_entrega = models.DateField()
    ped = models.ForeignKey(PED, on_delete=models.DO_NOTHING, related_name='atividades', null=True, blank=True)

    class Meta:
        abstract = False