from django.db import models

class Modalidade(models.TextChoices):
    PROEJA = 'ProEja', 'ProEja'
    INTEGRADO = 'Integrado', 'Integrado'
