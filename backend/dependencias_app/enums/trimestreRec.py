from django.db import models

class TrimestreRec(models.Model):
    TRIMESTRE_CHOICES = [
        ('1º', 'Primeiro'),
        ('2º', 'Segundo'),
        ('3º', 'Terceiro'),
        ('Todos', 'Todos')
    ]
    trimestre = models.CharField(max_length=5, choices=TRIMESTRE_CHOICES)

    def __str__(self):
        return self.trimestre