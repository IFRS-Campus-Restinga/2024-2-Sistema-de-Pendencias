import uuid
from django.db import models
from .base import BaseModel
from django.core.validators import MinLengthValidator

class Atividade(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], verbose_name="Título", blank=False, null=False)
    descricao = models.TextField(verbose_name="Descrição", blank=False, null=False)
    drive_id = models.CharField(max_length=255, null=True, blank=True, verbose_name="Drive")

    class Meta:
        abstract = True
