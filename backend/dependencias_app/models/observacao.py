from django.db import models
from .base import BaseModel
from django.core.validators import MinLengthValidator

class Observacao(BaseModel):
    data_insercao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Inserção")
    parecer = models.TextField(verbose_name="Parecer", help_text="Informe o parecer da observação", blank=False, null=False)
    status = models.CharField(max_length=50, choices=[('pendente', 'Pendente'), ('concluída', 'Concluída'), ('em andamento', 'Em andamento')], default='pendente', verbose_name="Status")
    acoes = models.TextField(verbose_name="Ações", help_text="Ações tomadas em relação à observação", blank=True, null=True)

    class Meta:
        verbose_name_plural = "Observações"
