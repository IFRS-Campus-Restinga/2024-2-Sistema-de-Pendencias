from django.db import models
from dependencias_app.models.base import *
from dependencias_app.models.dependencia import *
from dependencias_app.models.turma import *

class PPT(Dependencia):
    # Precisa relacionar com a tabela turma quando o cadastro for implementado
    turma = models.CharField(max_length=3)
    turmaProgressao = models.CharField(max_length=50)
