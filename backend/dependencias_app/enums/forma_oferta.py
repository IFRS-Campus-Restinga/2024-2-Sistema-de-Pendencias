from django.db import models

class Forma_Oferta(models.TextChoices):
    PRESENCIAL = 'Presencial'
    EAD = 'EAD'
    HIBRIDO = 'Híbrido'