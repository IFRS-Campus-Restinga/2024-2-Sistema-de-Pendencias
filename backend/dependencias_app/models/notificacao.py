import uuid
from django.db import models
from dependencias_app.models.base import BaseModel
from dependencias_app.enums.tipo_notificacao import Tipo_Notificacao

class Notificacao(BaseModel):
    usuario = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mensagem = models.CharField(null=False, blank=False, max_length=200)
    url = models.CharField(null=False, blank=False, max_length=100)
    lida = models.BooleanField(default=False)
    tipo = models.CharField(null=False, blank=False, max_length=17, choices=Tipo_Notificacao.choices)
    data = models.DateField(auto_now_add=True)

    class Meta:
        abstract = False