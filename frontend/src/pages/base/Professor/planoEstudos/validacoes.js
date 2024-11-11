// Validação para o campo "semestreAnoLetivo"
export const validarSemestreAnoLetivo = (semestreAnoLetivo) => {
  if (!semestreAnoLetivo || semestreAnoLetivo.length === 0) return 'Campo obrigatório.';
  return '';
};

// Função geral de validação que retorna os erros
export const validarFormularioPlanoEstudos = (formData) => {
  const erros = {};

  return erros;
};
