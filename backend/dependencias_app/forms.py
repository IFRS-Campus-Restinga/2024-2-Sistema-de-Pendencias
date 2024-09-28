from django import forms
from django.forms import ModelForm
from dependencias_app.models.aluno import Aluno

class AlunoForm(ModelForm):
    class Meta:
        model = Aluno
        fields = '__all__'
        widgets = {
            'dataNascimento': forms.DateInput(format='%d-%m-%Y', attrs={'type': 'date'}),
        }

