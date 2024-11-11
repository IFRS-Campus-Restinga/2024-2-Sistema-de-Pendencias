from django.contrib import admin
from dependencias_app.models.aluno import Aluno
from dependencias_app.models.curso import Curso
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.evento import Evento
from dependencias_app.models.ppt import PPT
from dependencias_app.models.professor import Professor
from dependencias_app.models.turma import Turma
from dependencias_app.models.ped import PED
from dependencias_app.models.planoEstudosEMI import PlanoEstudos_EMI
from dependencias_app.models.planoEstudosProEJA import PlanoEstudos_ProEJA
from dependencias_app.models.formEncerramento import FormEncerramento
from google_auth.models import UsuarioBase
from dependencias_app.models.atividade import Atividade


admin.site.register(Aluno)
admin.site.register(Curso)
admin.site.register(Disciplina)
admin.site.register(Evento)
admin.site.register(PPT)
admin.site.register(Professor)
admin.site.register(Turma)
admin.site.register(UsuarioBase)
admin.site.register(PED)
admin.site.register(PlanoEstudos_EMI)
admin.site.register(PlanoEstudos_ProEJA)
admin.site.register(FormEncerramento)
admin.site.register(Atividade)
