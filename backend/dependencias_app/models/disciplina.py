from django.core.validators import MaxValueValidator
from .base import *
from .curso import Curso

class Disciplina(BaseModel):
    cursos = models.ManyToManyField(Curso, related_name='disciplinas')
    nome = models.CharField(max_length=70, blank=False, null=False)
    carga_horaria = models.PositiveIntegerField(blank=False, null=False)

    class Meta:
        abstract = False

    def __str__(self):
        return f"{self.nome} - {self.carga_horaria} h"

