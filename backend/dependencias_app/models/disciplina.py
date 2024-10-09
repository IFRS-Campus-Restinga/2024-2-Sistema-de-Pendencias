from django.core.validators import MinValueValidator, MaxValueValidator
from .base import *
from .curso import Curso

class Disciplina(BaseModel):
    curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name="disciplinas",
        verbose_name="Curso",
        help_text="Selecione o curso da Disciplina",
        blank = False,
        null = False
    )
    name = models.CharField(
        max_length=36,
        verbose_name="Nome da Disciplina",
        help_text="Informe o nome da Disciplina",
        blank = False,
        null = False
    )
    carga_horaria = models.IntegerField(
        verbose_name="Carga Horária",
        help_text="Informe a carga horária da Disciplina",
        blank=False,
        null=False,
        validators=[MinValueValidator(1), MaxValueValidator(850)]
    )

    class Meta:
        abstract = False

    def __str__(self):
        return f"{self.name} ({self.curso} - {self.curso.modalidade})"

