from django.db import models
from dependencias_app.models.base import BaseModel
from google_auth.models import UsuarioBase
from dependencias_app.enums.tipoNotificacao import TipoNotificacao

class Notificacao(BaseModel):
    usuario = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING)
    mensagem = models.CharField(null=False, blank=False, max_length=200)
    url = models.CharField(null=False, blank=False, max_length=100)
    lida = models.BooleanField(default=False)
    tipo = models.CharField(null=False, blank=False, max_length=17, choices=TipoNotificacao.choices)
    data = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = False