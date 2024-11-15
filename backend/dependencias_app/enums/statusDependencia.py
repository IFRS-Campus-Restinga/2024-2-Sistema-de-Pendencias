from django.db import models

class StatusDependencia(models.TextChoices):
    CRIADA = 'Criada'
    PLANO_ESTUDOS_ELABORADO = 'Plano de Estudos Elaborado'
    EM_ANDAMENTO = 'Em Andamento'
    FINALIZADO = 'Finalizada'
    DESATIVADO = 'Desativado'