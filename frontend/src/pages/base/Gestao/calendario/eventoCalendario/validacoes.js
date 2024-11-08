const validarEvento = (formData) => {
  const errors = {};

// VALIDAÇÃO DO TÍTULO
if (!formData.titulo) {
  errors.titulo = "Campo obrigatório.";
} else if (formData.titulo.length < 5 || formData.titulo.length > 50) {
  errors.titulo = "Título deve ter entre 5 e 50 caracteres.";
} else if (!/^[A-Za-zÀ-ÿ0-9]+( [A-Za-zÀ-ÿ0-9]+)*$/.test(formData.titulo)) {
  errors.titulo = "Título deve conter apenas letras, números e espaços únicos.";
}

  // VALIDAÇÃO DA DESCRIÇÃO
  if (!formData.descricao) {
    errors.descricao = "Campo obrigatório.";
  } else if (formData.descricao.length < 10) {
    errors.descricao = "A descrição deve ter no mínimo 10 caracteres.";
  }

  // VALIDAÇÃO DA DATA DE INÍCIO
  if (!formData.data_inicio) {
    errors.data_inicio = "Campo obrigatório.";
  }

  // VALIDAÇÃO DA DATA DE FIM
  if (!formData.data_fim) {
    errors.data_fim = "Campo obrigatório.";
  }

  // VALIDAÇÃO DAS HORAS SE NÃO FOR DIA TODO
  if (!formData.dia_todo) {
    if (!formData.hora_inicio) {
      errors.hora_inicio = "Campo obrigatório.";
    }
    if (!formData.hora_fim) {
      errors.hora_fim = "Campo obrigatório.";
    }
  }

  // VALIDAÇÃO DO TIPO DE CALENDÁRIO
  if (!formData.tipo_calendario) {
    errors.tipo_calendario = "O tipo de calendário é obrigatório.";
  }

  // VALIDAÇÃO DE DATA E HORAS
  if (!formData.dia_todo) {
    const dataInicio = new Date(`${formData.data_inicio}T${formData.hora_inicio}`);
    const dataFim = new Date(`${formData.data_fim}T${formData.hora_fim}`);
    
    if (dataFim <= dataInicio) {
      errors.data_fim = "A data de fim deve ser posterior à data de início.";
    }
  }

  return errors;
};

export default validarEvento;