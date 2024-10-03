from django import forms
from django.forms import ModelForm
from dependencias_app.models.servidor import Servidor

class ServidorForm(ModelForm):
    class Meta:
        model = Servidor
        fields = '__all__'