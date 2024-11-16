// Validação para o campo "Forma de Oferta"
export const validarFormaOferta = (formaOferta) => {
  if (!formaOferta || formaOferta.length === 0);
  return '';
};

// Validação para o campo "Turno"
export const validarTurno = (turno) => {
  if (!turno || turno.length === 0);
  return '';
};

// Validação para o campo "Parecer Pedagógico"
export const validarParecerPedagogico = (parecerPedagogico) => {
  if (!parecerPedagogico || parecerPedagogico.length === 0);
  return '';
};

// Função geral de validação que retorna os erros
export const validarFormularioPlanoEstudos = (formData) => {
  const erros = {};

  // Validar os campos obrigatórios
  erros.forma_oferta = validarFormaOferta(formData.forma_oferta);
  erros.turno = validarTurno(formData.turno);
  erros.parecer_pedagogico = validarParecerPedagogico(formData.parecer_pedagogico);

  // Se houver algum erro, retornamos o objeto com os erros
  return erros;
};
