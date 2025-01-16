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

export const validarFormularioPlanoEstudos = (formData) => {
  const erros = {};

  // Validar os campos obrigatórios
  const erroFormaOferta = validarFormaOferta(formData.forma_oferta);
  const erroTurno = validarTurno(formData.turno);
  const erroParecerPedagogico = validarParecerPedagogico(formData.parecer_pedagogico);

  // Adiciona os erros ao objeto de erros
  if (erroFormaOferta) erros.forma_oferta = erroFormaOferta;
  if (erroTurno) erros.turno = erroTurno;
  if (erroParecerPedagogico) erros.parecer_pedagogico = erroParecerPedagogico;

  console.log('Erros encontrados na validação do formulário:', erros);

  return erros;
};
