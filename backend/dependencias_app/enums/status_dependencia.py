from django.db import models

class Status_Dependencia(models.TextChoices):
    CRIADA = 'Criada'
    EM_ANDAMENTO = 'Em Andamento'
    LANCADO = 'Lançada'
    FINALIZADO = 'Finalizada'
    DESATIVADO = 'Desativada'
