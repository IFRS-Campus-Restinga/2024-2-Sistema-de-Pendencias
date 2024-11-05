from django.db import models

class Turnos(models.TextChoices):
    MANHA = 'Manhã'
    TARDE = 'Tarde'
    NOITE = 'Noite'
    INTEGRAL = 'Integral'