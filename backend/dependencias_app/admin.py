from django.contrib import admin
from dependencias_app.models.aluno import Aluno
from dependencias_app.models.professor import Professor
from dependencias_app.models.aluno import Aluno
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from google_auth.models import UsuarioBase


admin.site.register(Aluno)
admin.site.register(Professor)
admin.site.register(Curso)
admin.site.register(Turma)
admin.site.register(UsuarioBase)