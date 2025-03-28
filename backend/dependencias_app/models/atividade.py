from django.db import models
from .base import BaseModel
from backend.dependencias_app.models.ped_EMI import PED_EMI
from backend.dependencias_app.models.ped_ProEJA import PED_ProEJA
from django.core.validators import MinLengthValidator
from google_auth.models import UsuarioBase

class Atividade(BaseModel):
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], verbose_name="Título", help_text="Informe o título da atividade", blank=False, null=False)
    descricao = models.TextField(verbose_name="Descrição", help_text="Informe a descrição da atividade", blank=False, null=False)
    drive_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        abstract = True

class Atividade_EMI(Atividade):
    professor = models.ForeignKey(UsuarioBase, on_delete=models.CASCADE, related_name='atividades_emi')
    
    class Meta:
        abstract = False
        verbose_name_plural = 'Atividades EMI'

class Atividade_ProEJA(Atividade):
    professor = models.ForeignKey(UsuarioBase, on_delete=models.CASCADE, related_name='atividades_proeja')

    class Meta:
        abstract = False
        verbose_name_plural = 'Atividades ProEJA'