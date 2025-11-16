from django.db import models

class GravidadeAcompanhamnto(models.TextChoices):
    LEVE = 'Leve'
    MODERADA = 'Moderada'
    GRAVE = 'Grave'
    GRAVISSIMA = 'Gravíssima'