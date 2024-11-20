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
    return 'Campo obrigatório';  // Apenas verifica se o campo está vazio
  }
  return null;  // Não há validação de limite de caracteres aqui
};

export const validarPeriodoLetivo = (periodoLetivo) => {
  if (!periodoLetivo || periodoLetivo.trim().length === 0) {
    return 'Campo obrigatório';
  }

  const periodo = periodoLetivo.trim();
  if (!/^\d{4}$/.test(periodo)) {
    return 'Período letivo deve ter 4 dígitos';
  }

  const periodoNumerico = parseInt(periodo, 10);
  const anoAtual = new Date().getFullYear(); // Ano atual
  const anoMinimo = 1900; // Ano mínimo
  const anoMaximo = anoAtual; // Ano máximo

  if (periodoNumerico < anoMinimo || periodoNumerico > anoMaximo) {
    return `Período letivo deve estar entre ${anoMinimo} e ${anoMaximo}`;
  }

  return null;
};

export const validarFormularioPlanoEstudos = (formData) => {
  const erros = {};

  // Validar os campos obrigatórios
  const erroFormaOferta = validarFormaOferta(formData.forma_oferta);
  const erroTurno = validarTurno(formData.turno);
  const erroParecerPedagogico = validarParecerPedagogico(formData.parecer_pedagogico);
  const erroPeriodoLetivo = validarPeriodoLetivo(formData.periodo_letivo);  

  // Adiciona os erros ao objeto de erros
  if (erroFormaOferta) erros.forma_oferta = erroFormaOferta;
  if (erroTurno) erros.turno = erroTurno;
  if (erroParecerPedagogico) erros.parecer_pedagogico = erroParecerPedagogico;
  if (erroPeriodoLetivo) erros.periodo_letivo = erroPeriodoLetivo;

  console.log('Erros encontrados na validação do formulário:', erros);

  return erros;
};
