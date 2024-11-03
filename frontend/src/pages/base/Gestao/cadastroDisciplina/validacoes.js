// Validação para o campo "carga horária"
export const validarCargaHoraria = (carga_horaria) => {
    if (!carga_horaria) {
        return 'Campo obrigatório.'; // Verifica se está vazio
    }
    
    const carga_horariaNum = Number(carga_horaria);
    
    if (isNaN(carga_horariaNum)) {
        return 'Carga horária deve ser um número.'; // Verifica se é um número
    }
    
    if (carga_horariaNum <= 0 || carga_horariaNum >= 800) {
        return 'Carga horária deve ser maior que 0 e menor que 800.'; // Verifica o intervalo
    }
    
    return '';
};

// Validação para o campo "curso"
export const validarCurso = (curso) => {
    if (!curso) {
        return 'Campo obrigatório.'; // Verifica se está vazio
    }
    return '';
};

// Função geral de validação que retorna os erros
export const validarFormularioDisciplina = (formData) => {
    const erros = {};

    const erroCurso = validarCurso(formData.curso);
    if (erroCurso) erros.curso = erroCurso;

    const erroNome = validarCurso(formData.nome);
    if (erroNome) erros.nome = erroNome;

    const erroCargaHoraria = validarCargaHoraria(formData.carga_horaria);
    if (erroCargaHoraria) erros.carga_horaria = erroCargaHoraria;

    return erros;
};

// Função para validar um campo específico
export const validarCampo = (campo, valor) => {
    switch (campo) {
        case 'curso':
            return validarCurso(valor);
        case 'nome':
            return validarCurso(valor);
        case 'carga_horaria':
            return validarCargaHoraria(valor);
        default:
            return '';
    }
};
