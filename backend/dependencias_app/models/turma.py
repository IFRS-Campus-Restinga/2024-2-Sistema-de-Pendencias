from django.db import models
from django.core.validators import MinLengthValidator
from .base import BaseModel
from .curso import Curso
import uuid


class Turma(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    numero = models.CharField(max_length=3,validators=[MinLengthValidator(3)],null=False,blank=False)
    curso = models.ForeignKey(Curso, related_name='turmas', on_delete=models.DO_NOTHING)

    class Meta:
        abstract = False

    def __str__(self):
        return self.numero
