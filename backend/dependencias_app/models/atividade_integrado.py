from django.db import models
from .atividade import Atividade
from .usuario import Usuario
from django.utils.translation import gettext_lazy as _

class AtividadeIntegrado(Atividade):
    professor = models.ForeignKey(Usuario, on_delete=models.CASCADE,editable=False, related_name='atividades_integrado')
    
    class Meta:
        abstract = False
