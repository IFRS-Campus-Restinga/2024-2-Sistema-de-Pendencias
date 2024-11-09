const validarEvento = (formData) => {
  const errors = {};

  // VALIDAÇÃO DO TÍTULO
  if (!formData.titulo) {
    errors.titulo = "Campo obrigatório.";
  } else if (!/^[A-Za-z0-9\s]+$/.test(formData.titulo)) {
    errors.titulo = "Título deve conter apenas letras e números.";
  } else if (!/^(?=.*\b\w{3,}\b\s+\b\w{3,}\b).*$/.test(formData.titulo)) {
    errors.titulo = "O título deve ter no mínimo duas palavras com três letras cada.";
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