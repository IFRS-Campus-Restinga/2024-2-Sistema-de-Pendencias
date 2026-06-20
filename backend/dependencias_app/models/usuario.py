from django.contrib.auth.models import Group
from django.db import models
from .base import BaseModel

class Usuario(BaseModel):
    USERNAME_FIELD = 'id'
    REQUIRED_FIELDS = []

    id = models.UUIDField(primary_key=True, editable=False)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, verbose_name="Grupo")
    is_active = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    @property
    def is_anonymous(self):
        return False

    @property
    def is_authenticated(self):
        return True

    def get_username(self):
        return str(self.id)

    def __str__(self):
        return f'{self.id} | {self.group.name}'

    class Meta:
        abstract = False