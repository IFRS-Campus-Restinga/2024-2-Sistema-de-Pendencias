from django.contrib import admin
from dependencias_app.models import Aluno
from dependencias_app.models import Usuario
from dependencias_app.models import Servidor

admin.site.register(Aluno)
admin.site.register(Usuario)
admin.site.register(Servidor)
