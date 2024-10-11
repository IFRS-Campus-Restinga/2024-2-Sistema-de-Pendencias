from django.contrib import admin
from dependencias_app.models.aluno import Aluno
from dependencias_app.models.servidor import Servidor
from dependencias_app.models.registrosEscolares import RegistrosEscolares
from dependencias_app.models.gestaoEscolar import GestaoEscolar
from dependencias_app.models.coordenador import Coordenador
from dependencias_app.models import Aluno, Disciplina
from dependencias_app.models import Usuario
from dependencias_app.models import Servidor
from dependencias_app.models import Curso
from dependencias_app.models import Turma


admin.site.register(Aluno)
admin.site.register(Servidor)
admin.site.register(RegistrosEscolares)
admin.site.register(GestaoEscolar)
admin.site.register(Coordenador)
admin.site.register(Curso)
admin.site.register(Turma)
admin.site.register(Disciplina)