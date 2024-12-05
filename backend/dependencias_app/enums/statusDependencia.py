from django.db import models

class StatusDependencia(models.TextChoices):
    CRIADA = 'Criada'
    EM_ATRASO = 'Em Atraso'
    EM_ANDAMENTO = 'Em Andamento'
    FINALIZADO = 'Finalizada'
    DESATIVADO = 'Desativado'