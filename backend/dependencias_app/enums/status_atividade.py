from django.db import models

class Status_Atividade(models.TextChoices):
    AVALIADA = 'Avaliada'
    NAO_AVALIADA = 'Não Avaliada'
