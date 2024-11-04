from django.db import models

class SituacaoDependencia(models.TextChoices):
    APROVADO = 'Aprovado'
    REPROVADO = 'Reprovado'
    EM_AVALIACAO = 'Em avaliação'