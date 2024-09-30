from dependencias_app.models.aluno import Aluno
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.forms import AlunoForm, DisciplinaForm
from django.shortcuts import get_object_or_404, redirect, render


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


def create_disciplina(request):
    """
    Função que realiza o cadastro de uma nova disciplina apartir do formulario DisciplinaForm.
    """
    if request.method == 'POST':
        form = DisciplinaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('disciplina_list')
        else:
            form = DisciplinaForm()

        context = {
            'form': form
        }
        return render(request, 'disciplina/create_disciplina.html', context)


def list_disciplinas(request):
    """
    Função que realiza a busca de todas as disciplinas cadastradas.
    """
    disciplinas = Disciplina.objects.all()

    if not disciplinas:
        mensagem = "Nenhuma Disciplina Cadastrada."
    else:
        mensagem = ""

    context = {
        'disciplinas': disciplinas,
        'mensagem': mensagem
    }

    return render(request, 'disciplina/list_disciplinas.html', context)