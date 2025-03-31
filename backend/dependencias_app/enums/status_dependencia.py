from django.db import models

class Status_Dependencia(models.TextChoices):
    CRIADA = 'Criada'
    EM_ATRASO = 'Em Atraso'
    EM_ANDAMENTO = 'Em Andamento'
    LANCADO = 'Lançado'
    FINALIZADO = 'Finalizada'
    DESATIVADO = 'Desativado'
    ENCERRADO = 'Encerrado'