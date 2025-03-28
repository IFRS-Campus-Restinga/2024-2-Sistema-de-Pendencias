from dependencias_app.models.base import *
from django.core.validators import MinLengthValidator
from dependencias_app.enums.modalidade import *
from django.core.exceptions import ValidationError

class Calendario_Academico(BaseModel):
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(3)], blank=False, null=False)
    data_inicio = models.DateTimeField(null=False, blank=False)
    data_fim = models.DateTimeField(null=False, blank=False)
    tipo_calendario = models.CharField(max_length=9, choices=Modalidade.choices, null=False, blank=False)

    class Meta:
        abstract = False

    def __str__(self):
        return f"{self.titulo} - ({self.tipo_calendario})"

# ADICIONADO MÉTODO CLEAN PARA VALIDAR SOBREPOSIÇÃO DE CALENDARIOS
    def clean(self):
        from datetime import datetime

        if Calendario_Academico.objects.filter(
            tipo_calendario=self.tipo_calendario
        ).exclude(
            id=self.id
        ).filter(
            data_inicio__lte=self.data_fim,
            data_fim__gte=self.data_inicio
        ).exists():
            raise ValidationError("Já existe um período letivo neste intervalo de datas para esse tipo de calendario")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)