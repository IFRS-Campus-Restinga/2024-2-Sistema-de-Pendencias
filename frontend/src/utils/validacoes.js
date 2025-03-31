
export const validarMatricula = (matricula) => {
    const regexMatricula = /^\d{10}$/

    if (matricula.length === 0) return 'Campo obrigatório'
    if (!regexMatricula.test(matricula)) return 'Matrícula inválida'

    return ''
}

export const validarEmailServidor = (email) => {
    const regexEmail = /^[^@]+@+restinga\.ifrs\.edu\.br$/;

    if(email.length === 0) return 'Campo obrigatório'
    if (!regexEmail.test(email)) return 'Email inválido'

    return ''
}