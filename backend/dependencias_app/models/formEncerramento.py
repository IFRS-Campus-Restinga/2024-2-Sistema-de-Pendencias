from django.db import models
from .base import BaseModel

class FormEncerramento(BaseModel):
    parecerFinal = models.TextField(null=False, blank=False, max_length=500)

    class Meta:
        abstract = False
    