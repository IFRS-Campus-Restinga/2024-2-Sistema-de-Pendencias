from django.core.validators import MaxValueValidator
from .base import *
from .curso import Curso

class Disciplina(BaseModel):
    cursos = models.ManyToManyField(Curso, related_name='disciplinas')
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

