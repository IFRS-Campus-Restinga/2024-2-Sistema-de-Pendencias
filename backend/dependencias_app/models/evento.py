from dependencias_app.models.base import *
from django.core.validators import MinLengthValidator
from .calendario_academico import Calendario_Academico
import uuid

class Evento(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], blank=False, null=False)
    descricao = models.CharField(max_length=300, validators=[MinLengthValidator(10)], null=False, blank=False)
    data_inicio = models.DateField(null=False, blank=False)
    data_fim = models.DateField(null=False, blank=False)
    hora_inicio = models.TimeField(null=True, blank=True)
    hora_fim = models.TimeField(null=True, blank=True)
    dia_todo = models.BooleanField(default=True)
    calendario = models.ForeignKey(Calendario_Academico, on_delete=models.DO_NOTHING, null=False, blank=False, related_name='eventos')

    class Meta:
        abstract = False


    def __str__(self):
        return f"{self.titulo}"