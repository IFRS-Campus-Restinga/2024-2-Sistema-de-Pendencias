from django.contrib import admin
from dependencias_app.models.aluno import Aluno
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.evento import Evento
from dependencias_app.models.calendarioAcademico import CalendarioAcademico
from dependencias_app.models.ppt import PPT
from dependencias_app.models.professor import Professor
from dependencias_app.models.turma import Turma
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.models.planoEstudos import PlanoEstudos
from dependencias_app.models.formEncerramento import FormEncerramento
from google_auth.models import UsuarioBase
from dependencias_app.models.atividade import *


admin.site.register(Aluno)
admin.site.register(Curso)
admin.site.register(Disciplina)
admin.site.register(Evento)
admin.site.register(CalendarioAcademico)
admin.site.register(PPT)
admin.site.register(Professor)
admin.site.register(Turma)
admin.site.register(UsuarioBase)
admin.site.register(PED_ProEJA)
admin.site.register(PED_EMI)
admin.site.register(PlanoEstudos)
admin.site.register(FormEncerramento)
admin.site.register(Atividade_EMI)
admin.site.register(Atividade_ProEJA)
