from django.db import models

class TrimestreRec(models.TextChoices):
    PRIMEIRO = '1º'
    SEGUNDO = '2º'
    TERCEIRO = '3º'
    PRIMEIRO_SEGUNDO = '1º, 2º'
    PRIMEIRO_TERCEIRO = '1º, 3º'
    SEGUNDO_TERCEIRO = '2º, 3º'
    TODOS = '1º, 2º, 3º'