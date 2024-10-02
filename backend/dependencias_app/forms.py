from django import forms
from django.forms import ModelForm
from dependencias_app.models.aluno import Aluno

from dependencias_app.models.servidor import Servidor

class AlunoForm(ModelForm):
    class Meta:
        model = Aluno
        fields = '__all__'
        widgets = {
            'dataNascimento': forms.DateInput(format='%d-%m-%Y', attrs={'type': 'date'}),
        }

class ServidorForm(ModelForm):
    class Meta:
        model = Servidor
        fields = '__all__'