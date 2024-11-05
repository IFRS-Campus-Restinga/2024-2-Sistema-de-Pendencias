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

    if (!/^\d+$/.test(carga_horaria)) {
        return 'Carga horária não pode conter espaços ou caracteres especiais.';
    }
    
    return '';
};

// Validação para o campo "name"
export const validarName = (name) => {
    if (!name) {
        return 'Campo obrigatório.'; // Verifica se está vazio
    }

    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) { // Verifica se contem caracteres especiais
        return 'Nome deve conter apenas letras e espaços.';
    }

    if (/([a-zA-Z])\1{2,}/.test(name)) { // verifica se a qualquer letra que se rapita mais de 3 vezes
        return 'Nome não pode conter letras repetidas em sequência.';
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

    const erroName = validarName(formData.name);
    if (erroName) erros.name = erroName;

    const erroCargaHoraria = validarCargaHoraria(formData.carga_horaria);
    if (erroCargaHoraria) erros.carga_horaria = erroCargaHoraria;

    return erros;
};

// Função para validar um campo específico
export const validarCampo = (campo, valor) => {
    switch (campo) {
        case 'curso':
            return validarCurso(valor);
        case 'name':
            return validarName(valor);
        case 'carga_horaria':
            return validarCargaHoraria(valor);
        default:
            return '';
    }
};
