export const validarFormaOferta = (formaOferta) => {
  if (!formaOferta || formaOferta.length === 0) {
    return 'Campo obrigatório';
  }
  return null;
};

export const validarTurno = (turno) => {
  if (!turno || turno.length === 0) {
    return 'Campo obrigatório';
  }
  return null;
};

export const validarParecerPedagogico = (parecerPedagogico) => {
  if (!parecerPedagogico || parecerPedagogico.trim().length === 0) {
    return 'Campo obrigatório';
  }
  return null;
};

export const validarAnoProgressao = (anoProgressao) => {
  if (!anoProgressao || anoProgressao.trim().length === 0) {
    return 'Campo obrigatório';
  }

  const ano = anoProgressao.trim();
  if (!/^\d{4}$/.test(ano)) {
    return 'Ano de progressão deve ter 4 dígitos';
  }

  const anoNumerico = parseInt(ano, 10);
  const anoAtual = new Date().getFullYear(); // Ano atual
  const anoMinimo = 1900; // Ano mínimo
  const anoMaximo = anoAtual; // Ano máximo

  if (anoNumerico < anoMinimo || anoNumerico > anoMaximo) {
    return `Ano de progressão deve estar entre ${anoMinimo} e ${anoMaximo}`;
  }

  return null;
};

export const validarFormularioPlanoEstudos = (formData) => {
  const erros = {};

  // Validar os campos obrigatórios
  const erroFormaOferta = validarFormaOferta(formData.forma_oferta);
  const erroTurno = validarTurno(formData.turno);
  const erroParecerPedagogico = validarParecerPedagogico(formData.parecer_pedagogico);
  const erroAnoProgressao = validarAnoProgressao(formData.ano_progressao);

  // Adiciona os erros ao objeto de erros
  if (erroFormaOferta) erros.forma_oferta = erroFormaOferta;
  if (erroTurno) erros.turno = erroTurno;
  if (erroParecerPedagogico) erros.parecer_pedagogico = erroParecerPedagogico;
  if (erroAnoProgressao) erros.ano_progressao = erroAnoProgressao;

  console.log('Erros encontrados na validação do formulário:', erros);

  return erros;
};
