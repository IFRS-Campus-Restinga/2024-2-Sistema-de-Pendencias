const validarNome = (nome) => {
    if (!nome || nome === '') return 'Campo obrigatório'
}

const validarCargaHoraria = (carga_horaria) => {
    if (!carga_horaria || carga_horaria === '') return 'Campo obrigatório'
    if (isNaN(carga_horaria)) return 'Campo inválido'
}

const validarCurso = (cursos) => {
    if (!cursos || cursos == []) return 'Campo obrigatório'
    
    cursos.map((curso) => {
        if (isNaN(curso)) return 'Campo inválido'
    })
}

export const validarFormEditarDisciplina = (formData) => {
    const erros = {}

    const erroNome = validarNome(formData.nome)
    if (erroNome) erros.nome = erroNome

    const erroCargaHoraria = validarCargaHoraria(formData.carga_horaria)
    if (erroCargaHoraria) erros.carga_horaria = erroCargaHoraria

    const erroCurso = validarCurso(formData.cursos)
    if (erroCurso) erros.cursos = erroCurso

    return erros
}