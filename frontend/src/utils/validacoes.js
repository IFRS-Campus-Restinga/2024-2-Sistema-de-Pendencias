export const validarCampoObrigatorio = (valor) => {
  if (!valor || valor.length === 0) return "Campo obrigatório";

  return null;
};

export const validarCampoUUID4 = (valor) => {
  const regexUUIDv4 =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!regexUUIDv4.test(valor)) return "Campo obrigatório";

  return null;
};

export const validarAnoSemestreReprov = (valor) => {
  const regex = /^\d{4}\/[12]$/;

  if (!valor || valor === "") return "Campo obrigatório";

  if (!regex.test(valor)) return "Formato deve seguir o padrão ano/semestre";

  return null;
};

export const validarSerieProgressao = (valor) => {
  const serieProgressao = ["1º Ano", "2º Ano", "3º Ano", "4º Ano"];

  if (!valor || valor === "") return "Campo obrigatório";

  if (!serieProgressao.includes(valor)) return "Série inválida";

  return null;
};
