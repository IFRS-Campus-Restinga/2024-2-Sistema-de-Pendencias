from base import *
"""from curso import Curso"""

class Disciplina(BaseModel):
    """curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name="disciplinas")"""
    name = models.CharField(max_length=100)
    carga_horaria = models.IntegerField()

    def __str__(self):
        return self.nome