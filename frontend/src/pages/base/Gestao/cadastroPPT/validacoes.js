// Validação para o campo "aluno"
export const validarAluno = (aluno) => {
    if (aluno.length === 0) return 'Campo obrigatório.';

    if (isNaN(aluno)) return 'Aluno Inválido'

    return ''
};

// Validação para o campo "turmaOrigem"
export const validarCurso = (curso) => {
    if (!curso) return 'Campo obrigatório.';
    if (isNaN(curso)) return 'Campo inválido'

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

    console.log(formData);

    const erroAluno = validarAluno(formData.aluno);
    if (erroAluno) erros.aluno = erroAluno;

    const erroCurso = validarCurso(formData.curso);
    if (erroCurso) erros.curso = erroCurso;

    const erroDisciplina = validarDisciplina(formData.disciplina);
    if (erroDisciplina) erros.disciplina = erroDisciplina;

    const erroTurmaOrigem = validarTurmaOrigem(formData.turmaOrigem);
    if (erroTurmaOrigem) erros.turmaOrigem = erroTurmaOrigem

    const erroTurmaProgressao = validarTurmaProgressao(formData.turmaProgressao);
    if (erroTurmaProgressao) erros.turmaProgressao = erroTurmaProgressao

    const erroDatas = validarDatas(formData.dataInicio, formData.dataFim);
    if (erroDatas) erros.datas = erroDatas

    return erros;
};