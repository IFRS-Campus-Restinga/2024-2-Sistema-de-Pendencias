from dependencias_app.models.base import *
from django.core.validators import MinLengthValidator
from dependencias_app.models.usuario import Usuario

class Servidor(Usuario):
    cpf = models.CharField(max_length=11, validators=[MinLengthValidator(11)], verbose_name="CPF", help_text="Digite o CPF", unique=True, null=False, blank=False)
    matricula = models.CharField(verbose_name="Matrícula", help_text="Informe a matrícula do Servidor", max_length=10, null=False, blank=False, unique=True,)

    class Meta:
        abstract = False