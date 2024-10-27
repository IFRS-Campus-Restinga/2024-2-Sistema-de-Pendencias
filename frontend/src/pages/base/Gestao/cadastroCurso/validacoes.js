// Validação para o campo "carga horária"
export const validarCargaHoraria = (carga_horaria) => {
    const carga_horariaRegex = /^\d{1,2}:\d{2}$/; // Aceita formato HH:MM (ex: 40:00)
    if (carga_horaria.length === 0) {
        return 'Campo obrigatório.';
    }
    if (!carga_horariaRegex.test(carga_horaria)) {
        return 'Carga horária deve estar no formato "HH:MM".';
    }
    const [horas, minutos] = carga_horaria.split(':').map(Number);
    if (horas < 0 || minutos < 0 || minutos >= 60) {
        return 'Carga horária deve ser um valor válido.';
    }
    return '';
};

// Validação para o campo "curso"
export const validarCurso = (curso) => {
    if (curso.length === 0) {
        return 'Campo obrigatório.'; // Garante que um curso seja selecionado
    }
    return ''; // Não faz validação adicional
};

// Validação para o campo "turmas"
export const validarTurma = (turmas) => {
    const turmaIntegradoRegex = /^\d{3}$/; // Aceita exatamente 3 dígitos
    const turmaProejaRegex = /^\d{4}\/\d{1}$/; // Aceita o formato 2023/2
    
    if (turmas.length === 0) return 'Campo obrigatório.';
    
    let erros = turmas.map((turma) => {
        if (!turmaIntegradoRegex.test(turma.numero) && !turmaProejaRegex.test(turma.numero)) {
            return 'Número da turma deve ser no formato "211" para Integrado ou "2023/2" para ProEja.';
        }
    })

    return erros
};

// Função geral de validação que retorna os erros
export const validarFormularioCurso = (formData) => {
    const erros = {};

    const erroCurso = validarCurso(formData.nome);
    if (erroCurso) erros.nome = erroCurso;

    const erroCargaHoraria = validarCargaHoraria(formData.carga_horaria);
    if (erroCargaHoraria) erros.carga_horaria = erroCargaHoraria;

    const turmasErros = validarTurma(formData.turmas)
    
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
            return validarCargaHoraria(valor)
        case 'turma':
            return validarTurma(valor);
        default:
            return '';
    }
};
