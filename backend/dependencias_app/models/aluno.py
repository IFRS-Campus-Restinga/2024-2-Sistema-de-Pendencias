from .usuario import Usuario
from django.db import models
from dependencias_app.models.base import *
from django.core.validators import MinLengthValidator


class Aluno(Usuario):
    cpf = models.CharField(max_length=11, validators=[MinLengthValidator(11)], verbose_name="CPF", help_text="Digite o CPF", null=True, blank=True)
    dataNascimento = models.DateField(verbose_name="DataNascimento", help_text="Informe a data de nascimento do Aluno", null=True, blank=True)
    matricula = models.CharField(verbose_name="Matricula", help_text="Informe a matrícula do Aluno", max_length=10, null=False, blank=False)
    telefone = models.CharField(verbose_name="Telefone", help_text="Informe o número de telefone do aluno", max_length=11, null=True, blank=True)

    class Meta:
        abstract = False