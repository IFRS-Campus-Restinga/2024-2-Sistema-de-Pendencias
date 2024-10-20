// Validação para o campo "carga horária"
export const validarCargaHoraria = (cargaHoraria) => {
    const cargaHorariaRegex = /^\d{1,2}:\d{2}$/; // Aceita formato HH:MM (ex: 40:00)
    if (!cargaHoraria) {
        return 'Campo obrigatório.';
    }
    if (!cargaHorariaRegex.test(cargaHoraria)) {
        return 'Carga horária deve estar no formato "HH:MM".';
    }
    const [horas, minutos] = cargaHoraria.split(':').map(Number);
    if (horas < 0 || minutos < 0 || minutos >= 60) {
        return 'Carga horária deve ser um valor válido.';
    }
    return '';
};

// Validação para o campo "modalidade"
export const validarModalidade = (modalidade) => {
    if (!modalidade) {
        return 'Campo obrigatório.'; // Verifica se o campo está vazio
    }
    return ''; // Não faz validação adicional
};

// Validação para o campo "curso"
export const validarCurso = (curso) => {
    if (!curso) {
        return 'Campo obrigatório.'; // Garante que um curso seja selecionado
    }
    return ''; // Não faz validação adicional
};

// Validação para o campo "turmas"
export const validarTurma = (turma) => {
    const turmaIntegradoRegex = /^\d{3}$/; // Aceita exatamente 3 dígitos
    const turmaProejaRegex = /^\d{4}\/\d{1}$/; // Aceita o formato 2023/2
    if (!turma.numero) {
        return 'Campo obrigatório.'; // Verifica se o número da turma está vazio
    }
    if (!turmaIntegradoRegex.test(turma.numero) && !turmaProejaRegex.test(turma.numero)) {
        return 'Número da turma deve ser no formato "211" para Integrado ou "2023/2" para ProEja.';
    }
    return '';
};

// Função geral de validação que retorna os erros
export const validarFormularioCurso = (formData) => {
    const erros = {};

    const erroCurso = validarCurso(formData.nome);
    if (erroCurso) erros.nome = erroCurso;

    const erroCargaHoraria = validarCargaHoraria(formData.cargaHoraria);
    if (erroCargaHoraria) erros.carga_horaria = erroCargaHoraria;

    const erroModalidade = validarModalidade(formData.modalidade);
    if (erroModalidade) erros.modalidade = erroModalidade;

    // Validação para turmas
    const turmasErros = (formData.turmas || []).map((turma) => validarTurma(turma)).filter(error => error !== '');
    
    if (turmasErros.length > 0) {
        erros.turmas = turmasErros;
    }

    return erros;
};

// Função para validar um campo específico
export const validarCampo = (campo, valor) => {
    switch (campo) {
        case 'nome':
            return validarCurso(valor); // Chama a validação para curso
        case 'carga_horaria':
            return validarCargaHoraria(valor);
        case 'modalidade':
            return validarModalidade(valor);
        case 'turma':
            return validarTurma(valor);
        default:
            return '';
    }
};
