from django.db import models
from .atividade import Atividade
from .custom_user import CustomUser

class AtividadeIntegrado(Atividade):
    professor = models.ForeignKey(CustomUser, on_delete=models.CASCADE,editable=False, related_name='atividades_integrado')
    
    class Meta:
        abstract = False
        verbose_name_plural = 'Atividades EMI'