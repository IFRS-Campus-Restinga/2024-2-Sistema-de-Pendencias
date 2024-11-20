// Validação para o campo "aluno"
export const validarAluno = (aluno) => {
    if (!aluno) return 'Campo obrigatório.';

    if (isNaN(aluno)) return 'Aluno Inválido'

    return ''
};

// Validação para o campo "turmaOrigem"
export const validarCurso = (curso) => {
    if (!curso) return 'Campo obrigatório.';
    if (isNaN(curso)) return 'Campo inválido'

    return ''
};

export const validarProfessor = (professor) => {
    if (!professor) return 'Campo obrigatório.';
    if (isNaN(professor)) return 'Campo inválido'

    return ''
};

// Validação para o campo "turmaOrigem"
export const validarDisciplina = (disciplina) => {
    if (!disciplina) return 'Campo obrigatório.';
    if (isNaN(disciplina)) return 'Campo inválido'

    return ''
};

// Validação para o campo "turmaOrigem"
export const validarTurmaOrigem = (turmaOrigem) => {
    if (!turmaOrigem || turmaOrigem === '') return 'Campo obrigatório.';
    if (isNaN(turmaOrigem)) return 'Campo inválido'

    return ''
};

// Validação para o campo "turmaProgressao"
export const validarTurmaProgressao = (turmaProgressao) => {
    if (!turmaProgressao || turmaProgressao === '') return 'Campo obrigatório.';
    if (isNaN(turmaProgressao)) return 'Campo inválido'

    return ''
};

export const validarTurmas = (turmaOrigem, turmaProgressao) => {
    if(turmaOrigem && turmaProgressao) {
        if (Number(turmaOrigem.numero) <= Number(turmaProgressao.numero)) return 'A turma de progressão não pode ser superior a de origem!'
    }

    return
}

export const validarDatas = (dataInicio, dataFim) => {
    if (!dataInicio || dataInicio === '') return 'Campo obrigatório.';
    if (!dataFim || dataFim === '') return 'Campo obrigatório.';
    if (dataFim < dataInicio) return 'Data de início não pode ser menor que a data de término da dependência'

    return ''
};


// Função geral de validação que retorna os erros
export const validarFormularioPPT = (formData) => {
    const erros = {};

    const erroAluno = validarAluno(formData.aluno);
    if (erroAluno) erros.aluno = erroAluno;

    const erroProfessorPPT = validarProfessor(formData.professor_ppt);
    if (erroProfessorPPT) erros.professor_ppt = erroProfessorPPT;
    
    const erroProfessorDisciplina = validarProfessor(formData.professor_disciplina);
    if (erroProfessorDisciplina) erros.professor_disciplina = erroProfessorDisciplina;

    const erroCurso = validarCurso(formData.curso);
    if (erroCurso) erros.curso = erroCurso;

    const erroDisciplina = validarDisciplina(formData.disciplina);
    if (erroDisciplina) erros.disciplina = erroDisciplina;

    const erroTurmaOrigem = validarTurmaOrigem(formData.turma_atual);
    if (erroTurmaOrigem) erros.turma_atual = erroTurmaOrigem

    const erroTurmaProgressao = validarTurmaProgressao(formData.turma_progressao);
    if (erroTurmaProgressao) erros.turma_progressao = erroTurmaProgressao

    return erros;
};