from dependencias_app.models.base import *
from django.core.validators import MinLengthValidator
from .calendario_academico import Calendario_Academico
import pytz
from django.utils import timezone


class Evento(BaseModel):
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], blank=False, null=False)
    descricao = models.CharField(max_length=300, validators=[MinLengthValidator(10)], null=False, blank=False)
    data_inicio = models.DateTimeField(null=False, blank=False)
    data_fim = models.DateTimeField(null=False, blank=False)
    calendario = models.ForeignKey(Calendario_Academico, on_delete=models.DO_NOTHING, null=False, blank=False, related_name='eventos')

    class Meta:
        abstract = False


    def __str__(self):
        return f"Evento: {self.titulo}"