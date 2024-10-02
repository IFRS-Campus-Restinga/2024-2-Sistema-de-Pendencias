from dependencias_app.models.base import *
from django.core.validators import MinLengthValidator
from dependencias_app.models.perfil import Perfil

class Servidor(BaseModel):
    perfil = models.CharField(verbose_name="Perfil", help_text="Informe o perfil", max_length=50, choices=Perfil)
    nome = models.CharField(verbose_name="Nome", help_text="Informe o nome do Servidor", max_length=100, validators=[MinLengthValidator(3)],  null=False, blank=False)
    cpf = models.CharField(max_length=11, validators=[MinLengthValidator(11)], verbose_name="CPF", help_text="Digite o CPF", unique=True, null=False, blank=False)
    matricula = models.CharField(verbose_name="Matrícula", help_text="Informe a matrícula do Servidor", max_length=10, null=False, blank=False, unique=True,)
    email = models.EmailField(verbose_name="E-mail", help_text="Informe o e-mail", null=False, blank=False)