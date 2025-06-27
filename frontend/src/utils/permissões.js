export const verificarGrupos = (grupos) => {
  let grupoSistema = [
    "gestao_escolar",
    "coord_reg_esc",
    "coord",
    "prof",
    "aluno",
  ];

  for (let grupo of grupos) {
    if (grupoSistema.includes(grupo)) return grupo;
  }
};
