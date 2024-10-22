// src/utils/validacoes.js

// Validação para o campo "nome"
// export const validarNome = (nome) => {
//   const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,100}$/;
//   if (!nome) {
//     return 'Campo obrigatório.';
//   }
//   if (!nameRegex.test(nome)) {
//     return 'Nome deve conter de 3 a 100 caracteres e aceitar apenas letras.';
//   }
//   return '';
// };

// Validação para o campo "email"
export const validarEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Campo obrigatório';
  }
  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }
  return '';
};

// // Validação para o campo "matrícula"
// export const validarMatricula = (matricula) => {
//   const matriculaRegex = /^\d{10}$/;
//   if (!matricula) {
//     return 'Campo obrigatório.';
//   }
//   if (!matriculaRegex.test(matricula)) {
//     return 'Matrícula inválida';
//   }
//   return '';
// };

// Função geral de validação que retorna os erros
export const validarFormulario = (formData) => {
  const erros = {};

  // const erroNome = validarNome(formData.nome);
  // if (erroNome) erros.nome = erroNome;

  const erroEmail = validarEmail(formData.email);
  if (erroEmail) erros.email = erroEmail;

  // const erroMatricula = validarMatricula(formData.matricula);
  // if (erroMatricula) erros.matricula = erroMatricula;

  return erros;
};

// Função para validar um campo específico
export const validarCampo = (campo, valor) => {
  switch (campo) {
    case 'email':
      return validarEmail(valor);
    default:
      return '';
  }
};
