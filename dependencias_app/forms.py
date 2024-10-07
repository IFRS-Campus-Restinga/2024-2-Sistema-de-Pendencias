from django import forms
from django.forms import ModelForm
from dependencias_app.models.disciplina import Disciplina

class DisciplinaForm(ModelForm):
    class Meta:
        model = Disciplina
        fields = '__all__'
        widgets = {
            'carga_horaria': forms.NumberInput(attrs={'min': 1}),
        }