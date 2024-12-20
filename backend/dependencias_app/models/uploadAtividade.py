from django.db import models
from dependencias_app.models.base import *
from django.core.validators import MinLengthValidator

class UploadAtividade(BaseModel):
    título = models.TextField(verbose_name="Título", max_length=100,validators=[MinLengthValidator(3)],null=False,blank=False)
    descrição = models.TextField(verbose_name="Descrição",null=True, blank=True)
    nota = models.PositiveIntegerField(verbose_name="Nota",null=True,blank=True)
    data_de_entrega = models.DateField(verbose_name="Data de entrega",null=False,blank=False)
    observacoes = models.TextField(max_length=500, null=True, blank=True)
    
    class Meta:
        abstract = False

    def __str__(self):
        return self.nome

    