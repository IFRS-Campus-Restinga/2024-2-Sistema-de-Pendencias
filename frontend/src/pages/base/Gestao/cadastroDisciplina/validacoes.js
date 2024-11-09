export const validarNovasDisciplinas = (novasDisciplinas) => {
    const erros = novasDisciplinas.map((novaDisciplina) => {

        let erroDisciplina = {}

        if (!novaDisciplina.nome || novasDisciplinas.nome === '') erroDisciplina.nome = 'Campo obrigatório'
        if (!novaDisciplina.carga_horaria || novaDisciplina.carga_horaria === '') erroDisciplina.carga_horaria = 'Campo obrigatório'
        if (isNaN(novaDisciplina.carga_horaria)) erroDisciplina.carga_horaria = 'Campo inválido'
        if (!novaDisciplina.professor || novaDisciplina.professor === '') erroDisciplina.professor = 'Campo obrigatório'
        if (isNaN(novaDisciplina.professor)) erroDisciplina.professor = 'Campo inválido'

        return erroDisciplina
    })

    return erros
}

export const validarCurso = (curso) => {
    if (curso === '') return 'Campo obrigatório'
    if (isNaN(curso)) return 'Campo inválido'

    return ''
}

// Função geral de validação que retorna os erros
export const validarFormularioDisciplina = (formData) => {
    const erros = {};

    const errosNovaDisciplina = validarNovasDisciplinas(formData.novasDisciplinas);
    if (errosNovaDisciplina) erros.novasDisciplinas = errosNovaDisciplina;

    const erroCurso = validarCurso(formData.curso)
    if (erroCurso) erros.curso = erroCurso;

    return erros;
};

// Função para validar um campo específico
export const validarCampo = (campo, valor) => {
    switch (campo) {
        case 'curso':
            return validarCurso(valor);
        case 'novasDisciplinas':
            return validarNovasDisciplinas(valor);
        default:
            return '';
    }
};
