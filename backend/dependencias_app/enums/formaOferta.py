from django.db import models

class FormaOferta(models.TextChoices):
    PRESENCIAL = 'Presencial'
    EAD = 'EAD'
    HIBRIDO = 'Híbrido'