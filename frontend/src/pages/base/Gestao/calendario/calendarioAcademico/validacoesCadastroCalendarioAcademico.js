export const validarCadastroCalendarioAcademico = (formData) => {
  let validationErrors = {};

  if (!formData.titulo || formData.titulo.length < 3) {
    validationErrors.titulo = "O título deve ter pelo menos 3 caracteres.";
  }
  if (!formData.data_inicio) {
    validationErrors.data_inicio = "Data de início é obrigatória.";
  }
  if (!formData.data_fim) {
    validationErrors.data_fim = "Data de fim é obrigatória.";
  } else if (formData.data_inicio && formData.data_fim < formData.data_inicio) {
    validationErrors.data_fim = "Data de fim deve ser posterior à data de início.";
  }

  return validationErrors;
};
