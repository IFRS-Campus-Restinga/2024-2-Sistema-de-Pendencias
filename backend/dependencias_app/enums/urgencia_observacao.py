from django.db import models

class Urgencia_Observacao(models.TextChoices):
    LEVE = 'Leve'
    MODERADA = 'Moderada'
    GRAVE = 'Grave'
    GRAVISSIMA = 'Gravíssima'