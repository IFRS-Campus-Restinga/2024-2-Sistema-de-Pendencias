export const validarCampoObrigatorio = (valor) => {
  if (!valor || valor.trim().length === 0) {
    return "Campo obrigatório";
  }

  const regexSegura = /^[a-zA-Z0-9À-ÿ\s.,;:!?()-]*$/;

  if (!regexSegura.test(valor)) {
    return "Caracteres inválidos detectados";
  }

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

export const validarDataMinima = (dataStr) => {
    if (!dataStr) return "Data inválida.";

    // dataStr vem no formato "YYYY-MM-DD"
    const data = new Date(dataStr + "T00:00:00");

    // criar data de hoje sem horário
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (data < hoje) {
        return "A data não pode ser menor que a data de hoje.";
    }

    return null;
}

export const validarDataMaxima = (data) => {
  const hoje = new Date();
  
  // Zera horas para comparar só a parte da data
  hoje.setHours(0, 0, 0, 0);

  const dt = new Date(data);
  dt.setHours(0, 0, 0, 0);

  if (dt > hoje) {
    throw new Error("A data não pode ser maior que a data atual.");
  }

  return null;
}

export const validarDatas = (data1, data2) => {
  const d1 = new Date(data1);
  const d2 = new Date(data2);

  if (d1 > d2) {
    return "A data de criação não pode ser maior que a data de entrega";
  }

  return null;
}
