from .modalidade import Modalidade
from dependencias_app.models.base import *
from django.core.validators import MinLengthValidator

class Curso(BaseModel):
    nome = models.CharField(
        verbose_name="Nome do Curso",
        help_text="Informe o nome do curso",
        max_length=55,
        validators=[MinLengthValidator(3)],
        null=False,
        blank=False
    )
    carga_horaria = models.CharField(
        verbose_name="Carga Horária",
        help_text="Informe a carga horária do curso",
        max_length=3,
        null=False,
        blank=False
    )
    modalidade = models.CharField(
        choices=Modalidade.choices,
        max_length=20
    )




    def __str__(self):
        return f"{self.nome} - {self.modalidade}"