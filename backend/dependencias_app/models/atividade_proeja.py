from django.db import models
from .atividade import Atividade
from .custom_user import CustomUser

class AtividadeProEJA(Atividade):
    professor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, editable=False, related_name='atividades_proeja')

    class Meta:
        abstract = False
        verbose_name_plural = 'Atividades ProEJA'