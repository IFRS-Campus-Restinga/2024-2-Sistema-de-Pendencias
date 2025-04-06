from django.db import models
from ..enums.modalidade import Modalidade
from dependencias_app.models.base import *
from django.core.validators import MinLengthValidator
from google_auth.models import Usuario
import uuid

class Curso(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=30,validators=[MinLengthValidator(3)],null=False,blank=False,unique=True)
    carga_horaria = models.CharField(max_length=5, null=False,blank=False)
    modalidade = models.CharField(choices=Modalidade.choices, max_length=20,null=False,blank=False)
    coordenador = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    
    
    class Meta:
        abstract = False

    def __str__(self):
        return self.nome

    