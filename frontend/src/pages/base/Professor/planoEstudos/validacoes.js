// Validação para o campo "aluno"
export const validarAluno = (aluno) => {
    if (aluno.length === 0) return 'Campo obrigatório.';
    if (Number(aluno) === NaN) return 'Aluno inválido';

    return '';
};

// Validação para o campo "curso"
export const validarCurso = (curso) => {
    if (!curso || Number(curso) === NaN) return 'Campo obrigatório.';
    return '';
};

// Validação para o campo "disciplina"
export const validarDisciplina = (disciplina) => {
    if (!disciplina || Number(disciplina) === NaN) return 'Campo obrigatório.';
    return '';
};

// Validação para o campo "forma_oferta"
export const validarFormaOferta = (forma_oferta) => {
    if (!forma_oferta || forma_oferta === '') return 'Campo obrigatório.';
    return '';
};

// Validação para o campo "turno"
export const validarTurno = (turno) => {
    if (!turno || turno === '') return 'Campo obrigatório.';
    return '';
};

// Validação para o campo "semestre_ano_letivo"
export const validarSemestreAnoLetivo = (semestre_ano_letivo) => {
    if (!semestre_ano_letivo || semestre_ano_letivo === '') return 'Campo obrigatório.';
    return '';
};

// Validação para o campo "componente_curricular"
export const validarComponenteCurricular = (componente_curricular) => {
    if (!componente_curricular || componente_curricular === '') return 'Campo obrigatório.';
    return '';
};

// Validação para o campo "semestre_serie_curso"
export const validarSemestreSerieCurso = (semestre_serie_curso) => {
    if (!semestre_serie_curso || semestre_serie_curso === '') return 'Campo obrigatório.';
    return '';
};

// Validação para o campo "trimestre_recuperar"
export const validarTrimestreRecuperar = (trimestre_recuperar) => {
    if (!trimestre_recuperar || trimestre_recuperar === '') return 'Campo obrigatório.';
    return '';
};

// Validação para o campo "datas"
export const validarDatas = (dataInicio, dataFim) => {
    if (!dataInicio || dataInicio === '') return 'Campo obrigatório.';
    if (!dataFim || dataFim === '') return 'Campo obrigatório.';
    if (dataFim < dataInicio) return 'Data de início não pode ser menor que a data de término.';

    return '';
};

// Função geral de validação que retorna os erros
export const validarFormularioPlanoEstudos = (formData) => {
    const erros = {};

    console.log(formData);

    // Validar os campos
    const erroAluno = validarAluno(formData.aluno);
    if (erroAluno) erros.aluno = erroAluno;

    const erroCurso = validarCurso(formData.curso);
    if (erroCurso) erros.curso = erroCurso;

    const erroDisciplina = validarDisciplina(formData.disciplina);
    if (erroDisciplina) erros.disciplina = erroDisciplina;

    const erroFormaOferta = validarFormaOferta(formData.forma_oferta);
    if (erroFormaOferta) erros.forma_oferta = erroFormaOferta;

    const erroTurno = validarTurno(formData.turno);
    if (erroTurno) erros.turno = erroTurno;

    const erroSemestreAnoLetivo = validarSemestreAnoLetivo(formData.semestre_ano_letivo);
    if (erroSemestreAnoLetivo) erros.semestre_ano_letivo = erroSemestreAnoLetivo;

    const erroComponenteCurricular = validarComponenteCurricular(formData.componente_curricular);
    if (erroComponenteCurricular) erros.componente_curricular = erroComponenteCurricular;

    const erroSemestreSerieCurso = validarSemestreSerieCurso(formData.semestre_serie_curso);
    if (erroSemestreSerieCurso) erros.semestre_serie_curso = erroSemestreSerieCurso;

    const erroTrimestreRecuperar = validarTrimestreRecuperar(formData.trimestre_recuperar);
    if (erroTrimestreRecuperar) erros.trimestre_recuperar = erroTrimestreRecuperar;

    const erroDatas = validarDatas(formData.dataInicio, formData.dataFim);
    if (erroDatas) erros.datas = erroDatas;

    console.log(erros);

    return erros;
};
