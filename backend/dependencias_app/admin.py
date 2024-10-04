from django.contrib import admin
from dependencias_app.models import Aluno
from dependencias_app.models import Usuario
from dependencias_app.models import Servidor
from dependencias_app.models import Curso
from dependencias_app.models import Turma

admin.site.register(Aluno)
admin.site.register(Usuario)
admin.site.register(Servidor)
admin.site.register(Curso)
admin.site.register(Turma)