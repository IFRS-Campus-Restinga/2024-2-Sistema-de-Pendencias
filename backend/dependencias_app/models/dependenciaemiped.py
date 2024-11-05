from django.db import models
from .dependencia import Dependencia  # Importando a classe Dependencia
from .curso import Curso  # Importando a classe Curso
from .turma import Turma  # Importando a classe Turma
from .disciplina import Disciplina  # Importando a classe Disciplina
from .professor import Professor  # Importando a classe Professor

class DependenciaEMIPED(Dependencia):  # Herança da classe Dependencia
    matricula = models.PositiveIntegerField(verbose_name="Matrícula")  # Campo de matrícula, apenas números
    name = models.CharField(max_length=100, verbose_name="Nome")  # Nome do aluno
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name="dependencias_emiped")  # Relacionamento com Curso
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name="dependencias_emiped")  # Relacionamento com Turma
    turma_ped = models.CharField(max_length=50, verbose_name="Turma da PED")  # Turma da PED
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE, related_name="dependencias_emiped")  # Relacionamento com Disciplina
    trimestre_recuperar = models.CharField(
        max_length=20,
        choices=[
            ('primeiro', 'Primeiro'),
            ('segundo', 'Segundo'),
            ('terceiro', 'Terceiro'),
            ('todos', 'Todos'),
        ],
        verbose_name="Trimestre a Recuperar"
    )  # Enum para trimestre a recuperar
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name="dependencias_emiped")  # Relacionamento com Professor

    class Meta:
        abstract = False

    def __str__(self):
        return f"{self.name} - {self.matricula} ({self.curso})"
