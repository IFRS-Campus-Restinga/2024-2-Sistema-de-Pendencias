from django.db import models
from django.core.validators import MinLengthValidator
from .base import BaseModel
from .curso import Curso


class Turma(BaseModel):
    numero = models.CharField(verbose_name="Número da Turma",help_text="Informe o número da turma",max_length=10,validators=[MinLengthValidator(1)],null=False,blank=False)
    curso = models.ForeignKey(Curso, related_name='turmas', on_delete=models.CASCADE)

    class Meta:
        abstract = False

    def __str__(self):
        return f'Turma {self.numero} - {self.curso.nome}'
