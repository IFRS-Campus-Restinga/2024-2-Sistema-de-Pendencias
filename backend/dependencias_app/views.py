from dependencias_app.models.aluno import Aluno
from dependencias_app.forms import AlunoForm
from django.shortcuts import render, get_object_or_404, redirect, render


def create(request):
    if request.method == 'POST':
        form = AlunoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('aluno_list')
    else:
        form = AlunoForm()
    context = {
        'form': form
    }
    return render(request, 'aluno/create_aluno.html', context)

def list_alunos(request):
    alunos = Aluno.objects.all()  # Busca todos os alunos
    context = {'alunos': alunos}
    return render(request, 'aluno/list_aluno.html', context)  # Crie o template list.html
