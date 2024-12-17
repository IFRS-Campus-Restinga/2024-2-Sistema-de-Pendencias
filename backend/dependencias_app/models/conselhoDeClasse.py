from dependencias_app.models.base import *
from django.db import models
from .dependencia import *
from .turma import *
from .calendarioAcademico import CalendarioAcademico
from django.core.validators import MinLengthValidator



class ConselhoDeClasse(Dependencia):
    turma_atual = models.ForeignKey(Turma, on_delete=models.DO_NOTHING, related_name='turma_atual')
    turma_progressao = models.ForeignKey(Turma, on_delete=models.DO_NOTHING, related_name='turma_progressao')
    data_reuniao = models.DateField(auto_now_add=True)
    horario = models.TimeField(auto_now_add=True)
    total_alunos = models.PositiveIntegerField(verbose_name="Número total de alunos",help_text="Informe o número total de alunos",null=False,blank=False)
    alunos_reprovados = models.PositiveIntegerField(verbose_name="Número total de alunos",help_text="Informe o número total de alunos",null=False,blank=False)
    alunos_pendencia = models.PositiveIntegerField(null=False,blank=False)
    alunos_ppt = models.PositiveIntegerField(null=False,blank=False)
    observacoes = models.TextField(max_length=500, null=True, blank=True)
    ata = models.TextField(max_length=5000,validators=[MinLengthValidator(11)], null=False, blank=False)
    
    

    class Meta:
        abstract = True

