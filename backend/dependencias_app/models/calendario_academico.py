from dependencias_app.models.base import *
from django.core.validators import MinLengthValidator
from dependencias_app.enums.modalidade import *
import uuid

class Calendario_Academico(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], blank=False, null=False)
    data_inicio = models.DateField(null=False, blank=False)
    data_fim = models.DateField(null=False, blank=False)
    tipo_calendario = models.CharField(max_length=9, choices=Modalidade.choices, null=False, blank=False)

    class Meta:
        abstract = False

    def __str__(self):
        return f"{self.titulo} - ({self.tipo_calendario})"