// src/utils/validacoes.js

// Validação para o campo "nome do curso"
export const validarNomeCurso = (nome) => {
    const nomeRegex = /^[a-zA-ZÀ-ÿ\s]{3,100}$/; // Aceita letras e espaços entre 3 e 100 caracteres
    if (!nome) {
        return 'Campo obrigatório.';
    }
    if (!nomeRegex.test(nome)) {
        return 'Nome do curso deve conter de 3 a 100 caracteres e aceitar apenas letras.';
    }
    return '';
};

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
    const modalidadesValidas = ['PROEJA', 'INTEGRADO']; // Modalidades válidas
    if (!modalidade) {
        return 'Campo obrigatório.';
    }
    if (!modalidadesValidas.includes(modalidade.toUpperCase())) {
        return 'Modalidade inválida. As opções válidas são: ProEja, Integrado.';
    }
    return '';
};

// Validação para o campo "turmas"
export const validarTurma = (turma) => {
    const turmaIntegradoRegex = /^\d{3}$/; // Aceita exatamente 3 dígitos
    const turmaProejaRegex = /^\d{4}\/\d{1}$/; // Aceita o formato 2023/2
    if (!turma.numero) {
        return 'Campo obrigatório.';
    }
    if (!turmaIntegradoRegex.test(turma.numero) && !turmaProejaRegex.test(turma.numero)) {
        return 'Número da turma deve ser no formato "211" para Integrado ou "2023/2" para ProEja.';
    }
    return '';
};

// Função geral de validação que retorna os erros
export const validarFormularioCurso = (formData) => {
    const erros = {};

    const erroNomeCurso = validarNomeCurso(formData.nome);
    if (erroNomeCurso) erros.nome = erroNomeCurso;

    const erroCargaHoraria = validarCargaHoraria(formData.cargaHoraria);
    if (erroCargaHoraria) erros.carga_horaria = erroCargaHoraria;

    const erroModalidade = validarModalidade(formData.modalidade);
    if (erroModalidade) erros.modalidade = erroModalidade;

    // Validação para turmas
    const turmasErros = (formData.turmas || []).map((turma, index) => {
        const erroTurma = validarTurma(turma);
        return erroTurma ? `Turma ${index + 1}: ${erroTurma}` : '';
    }).filter(error => error !== '');

    if (turmasErros.length > 0) {
        erros.turmas = turmasErros;
    }

    return erros;
};

// Função para validar um campo específico
export const validarCampo = (campo, valor) => {
    switch (campo) {
        case 'nome':
            return validarNomeCurso(valor);
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
