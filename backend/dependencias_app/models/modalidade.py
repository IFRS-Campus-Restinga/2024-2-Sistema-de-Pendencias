from django.db import models

class Modalidade(models.TextChoices):
    EMI = 'EMI', 'Educação de Jovens e Adultos (EMI)'
    PROEJA = 'PROEJA', 'Educação de Jovens e Adultos com Ensino Profissionalizante'

    # PROEJA = 'ProEja',
    # INTEGRADO = 'Ensino Medio Integrado',
