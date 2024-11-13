// Validação para o campo "aluno"
export const validarAluno = (aluno) => {
    if (!aluno || aluno.length === 0) return 'Campo obrigatório.';

    if (Number(aluno) === NaN) return 'Aluno Inválido'

    return ''
};

// Validação para o campo "professor"
export const validarProfessor = (professor) => {
    if (!professor || professor.length === 0) return 'Campo obrigatório.';

    if (Number(professor) === NaN) return 'Professor inválido'

    return '';
};

// Validação para o campo "turmaOrigem"
export const validarCurso = (curso) => {
    if (!curso || Number(curso) === NaN) return 'Campo obrigatório.';

    return ''
};

// Validação para o campo "turmaOrigem"
export const validarDisciplina = (disciplina) => {
    if (!disciplina || Number(disciplina) === NaN) return 'Campo obrigatório.';

    return ''
};

// Validação para o campo "turmaOrigem"
export const validarTurmaOrigem = (turmaOrigem) => {
    if (!turmaOrigem || isNaN(turmaOrigem)) return 'Campo obrigatório.';

    return ''
};

export const validarSerieProgressao = (serie_progressao) => {
    const series = ['1º Ano', '2º Ano','3º Ano','4º Ano']

    if (serie_progressao === '' || !serie_progressao) return 'Campo obrigatório'

    if (!series.includes(serie_progressao)) return 'Campo inválido'

    return ''
}

export const validarSerieTurma = (serie_progressao, turma_origem) => {
    if (serie_progressao && turma_origem) {
        if (Number(serie_progressao[0] >= Number(turma_origem.numero[0]))) return 'A série de progressão não pode ser superior ou igual à turma de origem'
    }

    return
}

export const validarAnoSemestreReprov = (ano_semestre_reprov) => {
    const turmaProejaRegex = /^\d{4}\/\d{1}$/; // Aceita o formato 2023/2
    if (!ano_semestre_reprov || ano_semestre_reprov === '') return 'Campo obrigatório'
    if (!turmaProejaRegex.test(ano_semestre_reprov)) return 'Número da turma deve ser no formato "20xx/x" para ProEja.';

}

export const validarTrimestreRec = (trimestresRec) => {
    if (!trimestresRec) return 'Campo obrigatório'

    const trimestres = ['1º', '2º', '3º']

    trimestresRec = trimestresRec.split(', ')

    console.log(trimestresRec)

    const hasInvalidTrimestre = trimestresRec.some((trimestre) => !trimestres.includes(trimestre));

    if (hasInvalidTrimestre) {
        return 'Valor inválido. Trimestres não reconhecidos.';
    }
}

// Função geral de validação que retorna os erros
export const validarFormularioPED = (formData, modalidade) => {
    const erros = {};

    const erroAluno = validarAluno(formData.aluno);
    if (erroAluno) erros.aluno = erroAluno;

    const erroProfessorPED = validarProfessor(formData.professor_ped);
    if (erroProfessorPED) erros.professor_ped = erroProfessorPED;

    const erroProfessorDisciplina = validarProfessor(formData.professor_disciplina);
    if (erroProfessorDisciplina) erros.professor_disciplina = erroProfessorDisciplina;

    const erroCurso = validarCurso(formData.curso);
    if (erroCurso) erros.curso = erroCurso;

    const erroDisciplina = validarDisciplina(formData.disciplina);
    if (erroDisciplina) erros.disciplina = erroDisciplina;

    if (modalidade === 'Integrado') {
        const erroTurmaOrigem = validarTurmaOrigem(formData.turma_origem)
        if (erroTurmaOrigem) erros.turma_origem = erroTurmaOrigem

        const erroSerieProgressao = validarSerieProgressao(formData.serie_progressao)
        if (erroSerieProgressao) erros.serie_progressao = erroSerieProgressao

        const erroTrimestreRecuperar = validarTrimestreRec(formData.trimestre_recuperar)
        if (erroTrimestreRecuperar) erros.trimestre_recuperar = erroTrimestreRecuperar

    } else if (modalidade === 'ProEJA') {
        const erroAnoSemestreReprov = validarAnoSemestreReprov(formData.ano_semestre_reprov)
        if (erroAnoSemestreReprov) erros.ano_semestre_reprov = erroAnoSemestreReprov
    } else {
        erros.modalidade = 'Modalidade Inválida'
    }
    
    return erros;
};