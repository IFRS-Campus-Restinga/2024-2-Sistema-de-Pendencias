import uuid
from django.db import models
from .base import BaseModel
from django.core.validators import MinLengthValidator

class Atividade(BaseModel):
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], verbose_name="Título", help_text="Informe o título da atividade", blank=False, null=False)
    descricao = models.TextField(verbose_name="Descrição", help_text="Informe a descrição da atividade", blank=False, null=False)
    drive_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        abstract = True

class Atividade_EMI(Atividade):
    professor = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    class Meta:
        abstract = False
        verbose_name_plural = 'Atividades EMI'

class Atividade_ProEJA(Atividade):
    professor = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = False
        verbose_name_plural = 'Atividades ProEJA'