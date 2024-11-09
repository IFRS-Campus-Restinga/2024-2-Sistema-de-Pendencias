from django.db import models

class TrimestreRec(models.TextChoices):
    PRIMEIRO = '1º'
    SEGUNDO = '2º'
    TERCEIRO = '3º'
    PRIMEIRO_SEGUNDO = '1º e 2º'
    PRIMEIRO_TERCEIRO = '1º e 3º'
    SEGUNDO_TERCEIRO = '2º e 3º'
    TODOS = 'Todos'