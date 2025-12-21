from django.contrib.auth.models import Group
from django.db import models
from .base import BaseModel

class Usuario(BaseModel):
    id = models.UUIDField(primary_key=True, editable=False)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, verbose_name="Grupo")
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.id} | {self.group.name}'
    
    class Meta:
        abstract = False