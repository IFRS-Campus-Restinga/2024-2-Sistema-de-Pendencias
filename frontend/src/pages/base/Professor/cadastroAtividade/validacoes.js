export const validarTitulo = (titulo) => { 
    if (!titulo || titulo.length === 0) {
      return 'Campo obrigatório';
    }
    return null;
  };
  
  export const validarData = (data) => {
    if (!data || data.length === 0) {
      return 'Campo obrigatório'; 
    }
    return null;
  };
  
  export const validarDescricao = (descricao) => {
    if (!descricao || descricao.trim().length === 0) {
      return 'Campo obrigatório';  
    }
    return null;
  };
  
  export const validarFormAtividade = (formData) => {
    const erros = {};
  
    // Validar os campos obrigatórios
    const erroTitulo = validarTitulo(formData.titulo);
    const erroData = validarData(formData.data_entrega);
    const erroDescricao = validarDescricao(formData.descricao);
  
    // Adiciona os erros ao objeto de erros
    if (erroTitulo) erros.titulo = erroTitulo;
    if (erroData) erros.data = erroData;
    if (erroDescricao) erros.descricao = erroDescricao;

    if (Object.keys(erros).length === 0) return null

    return erros;
  };