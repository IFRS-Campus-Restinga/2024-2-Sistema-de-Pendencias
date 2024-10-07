from .base import *
from django.db import models
from .curso import Curso

from .base import *
from django.db import models
from .curso import Curso

class Disciplina(BaseModel):
    curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name="disciplinas",
        verbose_name="Curso",
        help_text="Selecione o curso da disciplina"
    )
    name = models.CharField(
        max_length=55,
        verbose_name="Nome da Disciplina",
        help_text="Informe o nome da disciplina"
    )
    carga_horaria = models.IntegerField(
        verbose_name="Carga Horária",
        help_text="Informe a carga horária da disciplina"
    )

    def __str__(self):
        return f"{self.name} ({self.curso.nome} - {self.curso.modalidade})"

