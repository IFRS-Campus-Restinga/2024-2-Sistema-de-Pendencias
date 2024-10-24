from django.core.validators import MaxValueValidator
from .base import *
from .curso import Curso

class Disciplina(BaseModel):
    curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name="disciplinas",
        verbose_name="Curso",
        help_text="Selecione o Curso",
        blank=False,
        null=False
    )

    name = models.CharField(
        max_length=36,
        verbose_name="Nome da Disciplina",
        help_text="Nome disciplina",
        blank = False,
        null = False
    )
    carga_horaria = models.PositiveIntegerField(
        verbose_name="Carga Horaria",
        help_text="Carga horaria",
        blank=False,
        null=False,
        validators=[MaxValueValidator(800)]

    )

    class Meta:
        abstract = False

    def __str__(self):
        return f"{self.name} ({self.curso} - {self.curso.modalidade})"

