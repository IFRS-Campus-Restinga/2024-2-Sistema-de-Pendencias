from django.db import models

class TipoNotificacao(models.TextChoices):
    PED_PROEJA = 'PED ProEJA'
    PED_EMI = 'PED Integrado'
    PPT = 'PPT'
    Plano_Estudos = 'Plano de Estudos'
    Evento = 'Evento'
    Form_Encerramento = 'Form Encerramento'
    Atividade = 'Atividade'