from django.db import models

class Serie_Progressao (models.TextChoices):
    ANO_1 = '1º ano'
    ANO_2 = '2º ano'
    ANO_3 = '3º ano'
    ANO_4 = '4º ano'