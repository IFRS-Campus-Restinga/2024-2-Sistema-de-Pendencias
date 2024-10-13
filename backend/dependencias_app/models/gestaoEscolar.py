from django.db import models
from dependencias_app.models.usuario import Usuario
from django.core.validators import MinLengthValidator

class GestaoEscolar(Usuario):
    
    class Meta:
        abstract = False