// Validação para o campo "carga horária"
export const validarCargaHoraria = (carga_horaria) => {
    if (carga_horaria.length === 0) {
        return 'Campo obrigatório.';
    }

    if (Number(carga_horaria) === 0) {
        return 'A Carga horária de um curso deve ser maior que 0 horas'
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
            return 'Número da turma deve ser no formato "xxx" para Integrado ou "20xx/x" para ProEja.';
        }

        else return ''
    })

    return erros
};

// Função geral de validação que retorna os erros
export const validarFormularioCurso = (formData) => {
    const erros = {};

    console.log(formData)

    const erroCurso = validarCurso(formData.nome);
    if (erroCurso) erros.nome = erroCurso;

    const erroCargaHoraria = validarCargaHoraria(formData.carga_horaria);
    if (erroCargaHoraria) erros.carga_horaria = erroCargaHoraria;

    const turmasErros = validarTurma(formData.turmas)
    
    if (turmasErros.length > 0) {
        erros.turmas = turmasErros;
    }

    console.log(erros)

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
