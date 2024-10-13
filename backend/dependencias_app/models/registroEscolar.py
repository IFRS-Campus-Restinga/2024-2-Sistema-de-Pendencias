from .usuario import Usuario
from dependencias_app.models.base import *

class RegistroEscolar(Usuario):
    class Meta:
        db_table = 'dependencias_app_registroescolar'  
