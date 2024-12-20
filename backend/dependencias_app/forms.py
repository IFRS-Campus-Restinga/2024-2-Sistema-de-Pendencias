from django import forms

class ImportarDadosArquivo(forms.form):
    arquivo = forms.FileField()