from django import forms
from django.forms import ModelForm
from dependencias_app.models.aluno import Aluno
from dependencias_app.models.disciplina import Disciplina

class AlunoForm(ModelForm):
    class Meta:
        model = Aluno
        fields = '__all__'
        widgets = {
            'dataNascimento': forms.DateInput(format='%d-%m-%Y', attrs={'type': 'date'}),
        }

class DisciplinaForm(ModelForm):
    class Meta:
        model = Disciplina
        fields = '__all__'
        widgets = {
            'carga_horaria': forms.NumberInput(attrs={'min': 1}),
        }