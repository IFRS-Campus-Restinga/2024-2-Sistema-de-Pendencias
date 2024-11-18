// Validação para o campo "carga horária"
export const validarCargaHoraria = (carga_horaria) => {
    if (carga_horaria.length === 0) {
        return 'Campo obrigatório.';
    }

    // Verifica se a carga horária é um número inteiro
    if (!/^\d+$/.test(carga_horaria)) {
        return 'A Carga horária deve conter apenas números inteiros.';
    }

    if (Number(carga_horaria) <= 0) {
        return 'A Carga horária de um curso deve ser maior que 0 horas';
    }

    return '';
};

// Validação para o campo "coordenador"
export const validarCoordenador = (coordenador) => {
    if (!coordenador) return 'Campo obrigatório';

    // Aqui você pode adicionar qualquer validação para coordenador, caso seja necessário
    if (isNaN(coordenador)) return 'Coordenador inválido';

    return '';
};

// Validação para o campo "curso"
export const validarCurso = (curso) => {
    if (curso.length === 0) {
        return 'Campo obrigatório.';
    }

    // Verifica se o nome do curso tem pelo menos 3 caracteres, começa com letra maiúscula e pode conter acentos
    const regex = /^[A-ZÀ-ÿ][a-zA-ZÀ-ÿ\s]{2,}$/; // Permite letras com acentos, e um mínimo de 3 caracteres
    if (!regex.test(curso)) {
        return 'O Nome do curso deve começar com letra maiúscula e ter pelo menos 3 caracteres. Pode conter acentos e espaços.';
    }

    return '';
};

// Validação para o campo "turmas"
export const validarTurma = (turmas) => {
    const turmaIntegradoRegex = /^\d{3}$/; // Aceita exatamente 3 dígitos
    const turmaProejaRegex = /^\d{4}\/\d{1}$/; // Aceita o formato 2023/2

    if (turmas.length === 0) return 'Campo obrigatório.';

    let erros = turmas.map((turma) => {
        if (!turmaIntegradoRegex.test(turma.numero) && !turmaProejaRegex.test(turma.numero)) {
            return 'Número da turma deve ser no formato "xxx" para Integrado ou "20xx/x" para ProEja.';
        } else return '';
    });

    return erros.filter(erro => erro !== ''); // Retorna apenas os erros não vazios
};

// Função geral de validação que retorna os erros
export const validarFormularioCurso = (formData) => {
    const erros = {};

    const erroCurso = validarCurso(formData.nome);
    if (erroCurso) erros.nome = erroCurso;

    const erroCoordenador = validarCoordenador(formData.coordenador);
    if (erroCoordenador) erros.coordenador = erroCoordenador;

    const erroCargaHoraria = validarCargaHoraria(formData.carga_horaria);
    if (erroCargaHoraria) erros.carga_horaria = erroCargaHoraria;

    if (formData.modalidade === 'Integrado') {
        const turmasErros = validarTurma(formData.turmas);
        
        if (turmasErros.length > 0) {
            erros.turmas = turmasErros;
        }
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
        case 'turma':
            return validarTurma(valor);
        case 'coordenador':
            return validarCoordenador(valor);
        default:
            return '';
    }
};
