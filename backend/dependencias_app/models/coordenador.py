from dependencias_app.models.base import *
from google_auth.models import UsuarioBase
from django.core.validators import MinLengthValidator


class Coordenador(BaseModel):
    cpf = models.CharField(max_length=11, validators=[MinLengthValidator(11)], verbose_name="CPF", help_text="Digite o CPF", null=True, blank=True)
    matricula = models.CharField(verbose_name="Matricula", help_text="Informe a matrícula", max_length=10, null=False, blank=False)
    usuario = models.OneToOneField(UsuarioBase, on_delete=models.CASCADE, related_name='coordenador')
    
    class Meta:
        abstract = False
