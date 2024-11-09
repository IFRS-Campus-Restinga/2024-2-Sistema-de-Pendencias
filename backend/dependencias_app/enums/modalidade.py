from django.db import models

class Modalidade(models.TextChoices):
    INTEGRADO = 'Integrado', 'Ensino Médio Integrado'
    PROEJA = 'ProEJA', 'Educação de Jovens e Adultos com Ensino Profissionalizante'
