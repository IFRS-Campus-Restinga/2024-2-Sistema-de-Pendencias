from dependencias_app.models.base import *
from django.contrib.auth.models import Group
from django.core.validators import MinLengthValidator

class Usuario(models.Model):
    nome = models.CharField(max_length=100, validators=[MinLengthValidator(3)], verbose_name="Nome", help_text="Informe o nome", null=False, blank=False)
    email = models.EmailField(verbose_name="Email", help_text="Informe o e-mail", null=False, blank=False)
    perfil = models.ForeignKey(Group, on_delete=models.CASCADE)
    data_ingresso = models.DateField(verbose_name="Data de Ingresso", null=True, blank=True)
    last_login = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.nome} - {self.email}"
    
    class Meta:
        abstract = True
