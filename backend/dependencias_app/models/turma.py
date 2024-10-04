from django.db import models
from django.core.validators import MinLengthValidator
from .curso import Curso
from dependencias_app.models.base import BaseModel

class Turma(BaseModel):
    numero = models.CharField(verbose_name="Número da Turma",help_text="Informe o número da turma",
        max_length=10,validators=[MinLengthValidator(1)],null=False,blank=False)
    curso = models.ForeignKey('Curso', on_delete=models.CASCADE)

    def __str__(self):
        return f'Turma {self.numero} - {self.curso.nome}'