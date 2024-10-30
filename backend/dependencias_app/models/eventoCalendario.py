from dependencias_app.models.base import *
from google_auth.models import UsuarioBase
from django.core.validators import MinLengthValidator
from dependencias_app.models.tipoCalendario import TIPOS_CALENDARIO

class Evento(BaseModel):
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], verbose_name="Titulo", help_text="Informe o titulo do evento", blank=False, null=False)
    descricao = models.CharField(max_length=300, validators=[MinLengthValidator(10)], verbose_name="Descricao", help_text="Informe a descricao do evento", null=False, blank=False)
    data_inicio = models.DateField(verbose_name="DataInicio", help_text="Informe a data inicial do evento", null=False, blank=False)
    data_fim = models.DateField(verbose_name="DataFim", help_text="Informe a data final do evento", null=False, blank=False)
    tipo_calendario = models.CharField(max_length=6, choices=TIPOS_CALENDARIO, default='EMI', verbose_name="TipoCalendario", help_text="Selecione o tipo de calendário para o evento", null=False, blank=False)

    class Meta:
        abstract = False

    def __str__(self):
        return f"Evento: {self.titulo}"