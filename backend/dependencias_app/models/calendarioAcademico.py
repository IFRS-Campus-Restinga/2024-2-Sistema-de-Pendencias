from dependencias_app.models.base import *
from django.core.validators import MinLengthValidator
from dependencias_app.enums.modalidade import *

class CalendarioAcademico(BaseModel):
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], verbose_name="Titulo", help_text="Informe o titulo do calendário acadêmico", blank=False, null=False)
    data_inicio = models.DateTimeField(verbose_name="DataInicio", help_text="Informe a data inicial do calendário acadêmico", null=False, blank=False)
    data_fim = models.DateTimeField(verbose_name="DataFim", help_text="Informe a data final do calendário acadêmico", null=False, blank=False)
    tipo_calendario = models.CharField(max_length=9, choices=Modalidade.choices, default='Integrado', verbose_name="TipoCalendario", help_text="Selecione o tipo de calendário para o calendário acadêmico", null=False, blank=False)

    class Meta:
        abstract = False

    def __str__(self):
        return f"{self.titulo} - ({self.tipo_calendario})"
