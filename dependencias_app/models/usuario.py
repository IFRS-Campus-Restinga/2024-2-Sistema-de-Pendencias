

from dependencias_app.models.base import *
from django.core.validators import MinLengthValidator


class Usuario(BaseModel):
    nome = models.CharField(max_length=100, validators=[MinLengthValidator(3)], verbose_name="Nome", help_text="Informe o nome", null=False, blank=False)
    email = models.EmailField(verbose_name="Email", help_text="Informe o e-mail", null=False, blank=False)
    perfil = models.CharField(verbose_name="Perfil", help_text="Informe o perfil",max_length=100, null=False, blank=False)

    def __str__(self):
        return f"{self.nome} - {self.email}"