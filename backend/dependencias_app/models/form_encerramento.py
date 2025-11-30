import uuid
from django.db import models
from .base import BaseModel

class FormEncerramento(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parecer_final = models.TextField(null=False, blank=False, max_length=500, verbose_name="Parecer Final")
    drive_id = models.CharField(blank=False, null=False)

    class Meta:
        abstract = True

    