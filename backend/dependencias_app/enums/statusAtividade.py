from django.db import models

class StatusAtividade(models.TextChoices):
    AVALIADA = 'Avaliada'
    NAO_AVALIADA = 'Não Avaliada'
