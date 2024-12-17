from django.db import models
from dependencias_app.models.base import *
import datetime
from django.core.validators import MinValueValidator, MinLengthValidator, MaxLengthValidator
from dependencias_app.models.calendarioAcademico import CalendarioAcademico
from dependencias_app.models.turma import Turma
from dependencias_app.models.dependencia import Dependencia


class ConselhoDeClasse(BaseModel):
    """ 
    Model de Conselho de Classe, contendo todos seus atributos 
    """
    
    data_reuniao = models.DateField(default=datetime.date.today, help_text="Informe a data", verbose_name="Data da Reunião")  
    horario = models.TimeField(default=datetime.datetime.now, help_text="Informe o horário", verbose_name="Horário")
    total_alunos = models.IntegerField(validators=[MinValueValidator(0)], help_text="Informe o total de alunos", verbose_name="Total de Alunos")
    alunos_aprovados = models.IntegerField(validators=[MinValueValidator(0)], help_text="Informe o total de alunos aprovados", verbose_name="Alunos Aprovados")
    alunos_reprovados = models.IntegerField(validators=[MinValueValidator(0)], help_text="Informe o total de alunos reprovados", verbose_name="Alunos Reprovados")
    alunos_pendencia = models.IntegerField(validators=[MinValueValidator(0)], help_text="Informe o total de alunos em pendência", verbose_name="Alunos em Pendência")	
    alunos_ppt = models.IntegerField(validators=[MinValueValidator(0)], help_text="Informe o total de alunos em PPT", verbose_name="Alunos em PPT")
    observacoes = models.TextField(validators=[MaxLengthValidator(500)], null=True, blank=True, help_text="Informe as observações", verbose_name="Observações")
    ata = models.TextField(validators=[MinLengthValidator(10)], max_length=5000, null=False, blank=False, help_text="Informe a ata", verbose_name="Ata")
    calendarioAcademico = models.OneToOneField(CalendarioAcademico, on_delete=models.CASCADE, verbose_name="Calendário Acadêmico", help_text="Selecione o calendário acadêmico")
    turma = models.OneToOneField(Turma, on_delete=models.CASCADE, verbose_name="Turma", help_text="Selecione a turma")
    dependencia = models.ForeignKey(Dependencia, on_delete=models.DO_NOTHING, verbose_name="Dependência", help_text="Selecione a dependência")
    
    class Meta:
        abstract = False
        verbose_name = 'Conselho de Classe'