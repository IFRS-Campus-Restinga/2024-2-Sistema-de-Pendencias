// Validação para o campo "aluno"
export const validarAluno = (aluno) => {
  if (aluno.length === 0) return 'Campo obrigatório.';

  if (Number(aluno) === NaN) return 'Aluno Inválido';

  return '';
};

// Validação para o campo "curso"
export const validarCurso = (curso) => {
  if (!curso || Number(curso) === NaN) return 'Campo obrigatório.';
  return '';
};

// Validação para o campo "disciplina"
export const validarDisciplina = (disciplina) => {
  if (!disciplina || Number(disciplina) === NaN) return 'Campo obrigatório.';
  return '';
};

// Validação para o campo "semestreAnoLetivo"
export const validarSemestreAnoLetivo = (semestreAnoLetivo) => {
  if (!semestreAnoLetivo || semestreAnoLetivo.length === 0) return 'Campo obrigatório.';
  return '';
};

// Função geral de validação que retorna os erros
export const validarFormularioPlanoEstudos = (formData) => {
  const erros = {};

  // Validação para o aluno
  const erroAluno = validarAluno(formData.aluno);
  if (erroAluno) erros.aluno = erroAluno;

  // Validação para o curso
  const erroCurso = validarCurso(formData.curso);
  if (erroCurso) erros.curso = erroCurso;

  // Validação para a disciplina
  const erroDisciplina = validarDisciplina(formData.disciplina);
  if (erroDisciplina) erros.disciplina = erroDisciplina;

  // Validação para o semestreAnoLetivo
  const erroSemestreAnoLetivo = validarSemestreAnoLetivo(formData.semestreAnoLetivo);
  if (erroSemestreAnoLetivo) erros.semestreAnoLetivo = erroSemestreAnoLetivo;

  return erros;
};
