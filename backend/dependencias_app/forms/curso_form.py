from django import forms
from django.forms import ModelForm
from dependencias_app.models.curso import Curso

class CursoForm(ModelForm):
    class Meta:
        model = Curso
        fields = '__all__'