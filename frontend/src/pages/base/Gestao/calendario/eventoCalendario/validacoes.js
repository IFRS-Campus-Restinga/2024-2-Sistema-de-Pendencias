// validacoesEvento.js

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

  // VALIDAÇÃO DO TIPO DE CALENDÁRIO
  if (!formData.tipo_calendario) {
    errors.tipo_calendario = "O tipo de calendário é obrigatório.";
  }

  return errors;
};

export default validarEvento;
