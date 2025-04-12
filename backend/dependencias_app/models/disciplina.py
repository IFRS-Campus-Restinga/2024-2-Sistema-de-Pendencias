from django.core.validators import MaxValueValidator
from .base import *
from .curso import Curso
import uuid

class Disciplina(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cursos = models.ManyToManyField(Curso, related_name='disciplinas')
    nome = models.CharField(max_length=70, blank=False, null=False)
    carga_horaria = models.CharField(max_length=2, blank=False, null=False)

    class Meta:
        abstract = False

    def __str__(self):
        return self.nome

