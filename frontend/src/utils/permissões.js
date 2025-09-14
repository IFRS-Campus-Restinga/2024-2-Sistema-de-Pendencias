export const verificarGrupos = (grupo) => {
  let grupoSistema = [
    "gestao_escolar",
    "coord_reg_esc",
    "coord",
    "professor",
    "aluno",
  ];

  if (grupoSistema.includes(grupo)) {
    return grupo;
  }
};
