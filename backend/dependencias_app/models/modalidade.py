from django.db import models

class Modalidade(models.TextChoices):
    INTEGRADO = 'Integrado', 'Educação de Jovens e Adultos (EMI)'
    PROEJA = 'PROEJA', 'Educação de Jovens e Adultos com Ensino Profissionalizante'
