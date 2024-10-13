from django.db import models
from dependencias_app.models.usuario import Usuario
from django.core.validators import MinLengthValidator

class GestaoEscolar(Usuario):
    cpf = models.CharField(verbose_name="CPF", help_text="Digite o CPF", max_length=11, validators=[MinLengthValidator(11)], null=True, blank=True)
    matricula = models.CharField(verbose_name="Matricula", help_text="Informe a matrícula do(a) gestor(a)", max_length=10, null=True, blank=True)

    class Meta:
        abstract = False