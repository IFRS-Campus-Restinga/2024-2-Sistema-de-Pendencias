// Validação para o campo "aluno"
export const validarAluno = (aluno) => {
    if (aluno.length === 0) return 'Campo obrigatório.';

    if (Number(aluno) === NaN) return 'Matrícula inválida'

    return ''
};

// Validação para o campo "professor"
export const validarProfessor = (professor) => {
    if (professor.length === 0) return 'Campo obrigatório.';

    if (!professor.includes('@')) return 'Email inválido'

    return '';
};

// Validação para o campo "turmaOrigem"
export const validarCurso = (curso) => {
    if (!curso || curso === '') return 'Campo obrigatório.';

    return ''
};

// Validação para o campo "turmaOrigem"
export const validarDisciplina = (disciplina) => {
    if (!disciplina || disciplina === '') return 'Campo obrigatório.';

    return ''
};

// Validação para o campo "turmaOrigem"
export const validarTurmaOrigem = (turmaOrigem) => {
    if (!turmaOrigem || turmaOrigem === '') return 'Campo obrigatório.';

    return ''
};

// Validação para o campo "turmaProgressao"
export const validarTurmaProgressao = (turmaProgressao) => {
    if (!turmaProgressao || turmaProgressao === '') return 'Campo obrigatório.';

    return ''
};

export const validarDataInicio = (dataInicio) => {
    if (!dataInicio || dataInicio === '') return 'Campo obrigatório.';

    return ''
};
export const validarDataFim = (dataFim) => {
    if (!dataFim || dataFim === '') return 'Campo obrigatório.';

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

    const erroTurmaOrigem = validarTurmaOrigem(formData.turmaOrigem);
    if (erroTurmaOrigem) erros.turmaOrigem = erroTurmaOrigem

    const erroTurmaProgressao = validarTurmaProgressao(formData.turmaProgressao);
    if (erroTurmaProgressao) erros.turmaProgressao = erroTurmaProgressao

    const erroDataInicio = validarDataInicio(formData.dataInicio);
    if (erroDataInicio) erros.dataInicio = erroDataInicio

    const erroDataFIm = validarDataFim(formData.dataFim);
    if (erroDataFIm) erros.dataFim = erroDataFIm

    console.log(erros);

    return erros;
};