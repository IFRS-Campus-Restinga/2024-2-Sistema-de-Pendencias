// Validação para o campo "status"
export const validarStatus = (status) => {
    if (!status) {
        return 'Campo obrigatório.'; // Verifica se está vazio
    }
    
    const opcoesValidas = ['ativo', 'inativo']; // Definindo as opções válidas
    if (!opcoesValidas.includes(status.toLowerCase())) {
        return 'Status deve ser "ativo" ou "inativo".'; // Verifica se o valor é válido
    }

    return '';
};

// Validação para o campo "dataInicio"
export const validarDataInicio = (dataInicio) => {
    if (!dataInicio) {
        return 'Campo obrigatório.'; // Verifica se está vazio
    }
    
    const data = new Date(dataInicio);
    const hoje = new Date();

    if (isNaN(data.getTime())) {
        return 'Data de início deve ser uma data válida.'; // Verifica se é uma data válida
    }

    if (data < hoje) {
        return 'Data de início não pode ser anterior à data atual.'; // Verifica se a data é no futuro
    }

    return '';
};

// Validação para o campo "dataFinal"
export const validarDataFinal = (dataFinal, dataInicio) => {
    if (!dataFinal) {
        return 'Campo obrigatório.'; // Verifica se está vazio
    }
    
    const data = new Date(dataFinal);
    const inicio = new Date(dataInicio);
    
    if (isNaN(data.getTime())) {
        return 'Data final deve ser uma data válida.'; // Verifica se é uma data válida
    }

    if (data < inicio) {
        return 'Data final deve ser posterior à data de início.'; // Verifica se a data final é maior que a data de início
    }

    return '';
};

// Validação para o campo "matricula"
export const validarMatricula = (matricula) => {
    if (!matricula) {
        return 'Campo obrigatório.'; // Verifica se está vazio
    }

    const matriculaRegex = /^[0-9]+$/; // Verifica se a matrícula é composta apenas por números
    if (!matriculaRegex.test(matricula)) {
        return 'Matrícula deve conter apenas números.'; // Verifica se o formato é válido
    }

    return '';
};

// Validação para o campo "nome"
export const validarName = (nome) => {
    if (!nome) {
        return 'Campo obrigatório.'; // Verifica se está vazio
    }

    if (nome.length > 100) {
        return 'Nome não pode ter mais que 100 caracteres.'; // Verifica o tamanho do nome
    }

    return '';
};

// Validação para o campo "curso"
export const validarCurso = (curso) => {
    if (!curso) {
        return 'Campo obrigatório.'; // Verifica se está vazio
    }

    // Supondo que temos uma lista de cursos válidos
    const cursosValidos = ['Curso A', 'Curso B', 'Curso C']; // Exemplos de cursos
    if (!cursosValidos.includes(curso)) {
        return 'Curso inválido. Selecione um curso da lista.'; // Verifica se o curso é válido
    }

    return '';
};

// Função geral de validação que retorna os erros
export const validarFormularioEmiPed = (formData) => {
    const erros = {};

    const erroStatus = validarStatus(formData.status);
    if (erroStatus) erros.status = erroStatus;

    const erroDataInicio = validarDataInicio(formData.dataInicio);
    if (erroDataInicio) erros.dataInicio = erroDataInicio;

    const erroDataFinal = validarDataFinal(formData.dataFinal, formData.dataInicio);
    if (erroDataFinal) erros.dataFinal = erroDataFinal;

    const erroMatricula = validarMatricula(formData.matricula);
    if (erroMatricula) erros.matricula = erroMatricula;

    const erroNome = validarName(formData.nome);
    if (erroNome) erros.nome = erroNome;

    const erroCurso = validarCurso(formData.curso);
    if (erroCurso) erros.curso = erroCurso;

    return erros;
};

// Função para validar um campo específico
export const validarCampo = (campo, valor, formData) => {
    switch (campo) {
        case 'status':
            return validarStatus(valor);
        case 'dataInicio':
            return validarDataInicio(valor);
        case 'dataFinal':
            return validarDataFinal(valor, formData.dataInicio);
        case 'matricula':
            return validarMatricula(valor);
        case 'nome':
            return validarName(valor);
        case 'curso':
            return validarCurso(valor);
        default:
            return '';
    }
};
