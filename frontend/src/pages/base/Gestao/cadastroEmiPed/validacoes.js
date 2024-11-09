// Validação para o campo "aluno"
export const validarAluno = (aluno) => {
    if (aluno.length === 0) return 'Campo obrigatório.';

    if (Number(aluno) === NaN) return 'Aluno Inválido'

    return ''
};

// Validação para o campo "professor"
export const validarProfessor = (professor) => {
    if (professor.length === 0) return 'Campo obrigatório.';

    if (Number(professor) === NaN) return 'Professor inválido'

    return '';
};

// Validação para o campo "turmaOrigem"
export const validarCurso = (curso) => {
    if (!curso || Number(curso) === NaN) return 'Campo obrigatório.';

    return ''
};

// Validação para o campo "turmaOrigem"
export const validarDisciplina = (disciplina) => {
    if (!disciplina || Number(disciplina) === NaN) return 'Campo obrigatório.';

    return ''
};

// Validação para o campo "turmaOrigem"
export const validarTurmaOrigem = (turmaOrigem) => {
    if (!turmaOrigem || Number(turmaOrigem) === NaN) return 'Campo obrigatório.';

    return ''
};

// Validação para o campo "turmaProgressao"
export const validarTurmaProgressao = (turmaProgressao) => {
    if (!turmaProgressao || turmaProgressao === '') return 'Campo obrigatório.';

    return ''
};

export const validarTurmas = (turmaOrigem, turmaProgressao) => {
    if(turmaOrigem && turmaProgressao) {
        if (Number(turmaOrigem.numero) < Number(turmaProgressao.numero)) return 'A turma de progressão não pode ser superior a de origem!'
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

    const erroProfessor = validarProfessor(formData.professor);
    if (erroProfessor) erros.professor = erroProfessor;

    const erroCurso = validarCurso(formData.curso);
    if (erroCurso) erros.curso = erroCurso;

    const erroDisciplina = validarDisciplina(formData.disciplina);
    if (erroDisciplina) erros.disciplina = erroDisciplina;

    const erroTurma = validarTurmaOrigem(formData.turmaOrigem);
    if (erroTurma) erros.turmaOrigem = erroTurma

    const erroSerieAnoProgressao = validarTurmaProgressao(formData.serieAnoProgressao);
    if (erroSerieAnoProgressao) erros.serieAnoProgressao = erroSerieAnoProgressao

    const erroDatas = validarDatas(formData.dataInicio, formData.dataFim);
    if (erroDatas) erros.datas = erroDatas


    console.log(erros);

    return erros;
};