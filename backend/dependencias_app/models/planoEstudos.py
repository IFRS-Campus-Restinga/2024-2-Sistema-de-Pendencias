from django.db import models
from .base import BaseModel
from dependencias_app.models.dependencia import *
from dependencias_app.enums.formaOferta import FormaOferta
from dependencias_app.enums.turnos import Turnos


class PlanoEstudos(BaseModel):
    campus = models.CharField(verbose_name="Campus",default='Restinga', help_text="Informe o campus", max_length=20, null=False, blank=False)
    semestre_ano_letivo = models.CharField(verbose_name="Semestre/Ano Letivo", help_text="Exemplo: 2024/1", max_length=5, null=False, blank=False)
    componente_curricular = models.CharField(verbose_name="Componente Curricular", help_text="Informe o componente curricular", max_length=100, null=False, blank=False)
    semestre_serie_curso = models.CharField(verbose_name="Semestre/Série do Curso", help_text="Informe o semestre/série", max_length=20, null=False, blank=False)
    trimestre_recuperar = models.CharField(verbose_name="Trimestre a Recuperar", help_text="Informe o trimestre", max_length=20, null=False, blank=False)
    forma_oferta = models.CharField(verbose_name="Forma de Oferta", help_text="Selecione a forma de oferta", choices=FormaOferta.choices, max_length=20, null=False, blank=False)
    turno = models.CharField(verbose_name="Turno", help_text="Selecione o turno", choices=Turnos, max_length=10, null=False, blank=False)
    parecer_pedagogico = models.TextField(verbose_name="Parecer Pedagógico", help_text="Informe o parecer pedagógico",blank=False, null=False, max_length=500)

    # sobrescrita dos related names dos campos chave estrangeira herdados de Dependencia
    aluno = models.ForeignKey(UsuarioBase, on_delete=models.DO_NOTHING, related_name='aluno_planoEstudos')
    curso = models.ForeignKey(Curso, on_delete=models.DO_NOTHING, related_name='curso_planoEstudos')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.DO_NOTHING, related_name='disciplina_planoEstudos')


    class Meta:
        abstract = False