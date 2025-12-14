from django.db import models

class Situacao_Dependencia(models.TextChoices):
    APROVADO = 'Aprovado'
    REPROVADO = 'Reprovado'
    EM_AVALIACAO = 'Em avaliação'
    CANCELADA = 'Cancelada'