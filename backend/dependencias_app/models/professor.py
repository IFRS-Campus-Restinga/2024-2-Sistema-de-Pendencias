from django.db import models
from dependencias_app.models.usuario import Usuario
from django.core.validators import MinLengthValidator


class Professor(Usuario):
    cpf = models.CharField(max_length=11, validators=[MinLengthValidator(11)], verbose_name="CPF", help_text="Digite o CPF", null=True, blank=True)
    matricula = models.CharField(verbose_name="Matricula", help_text="Informe a matrícula do Aluno", max_length=10, null=False, blank=False)

    class Meta:
        abstract = False
