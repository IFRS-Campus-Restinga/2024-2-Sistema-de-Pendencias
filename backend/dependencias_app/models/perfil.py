from django.db import models

class Perfil(models.TextChoices):
    PROFESSOR = "Professor"
    REGISTROS_ESCOLARES = "Registros Escolares"
    GESTAO_ESCOLAR = "Gestão Escolar"
    COORDENADOR = "Coordenador"