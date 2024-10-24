// Validação para o campo "nome"
// export const validarNome = (nome) => {
//   const nomeRegex = /^[a-zA-ZÀ-ÿ\s]{3,100}$/;
//   if (!nome) {
//     return 'Campo obrigatório.';
//   }
//   if (!nomeRegex.test(nome)) {
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

// Validação para o campo "cpf"
// export const validarCPF = (cpf) => {
//   const cpfNumerico = cpf.replace(/\D/g, '');
//   const cpfRegex = /^\d{11}$/;

//   if (!cpf) {
//     return 'Campo obrigatório.';
//   }

//   if (!cpfRegex.test(cpfNumerico)) {
//     return 'CPF deve conter 11 dígitos.';
//   }
//   // Verifica se o CPF é válido com o algoritmo de validação
//   let soma = 0;
//   let resto;

//   // CPF inválidos conhecidos
//   if (cpfNumerico === "00000000000" || cpfNumerico === "11111111111" || cpfNumerico === "22222222222" ||
//     cpfNumerico === "33333333333" || cpfNumerico === "44444444444" || cpfNumerico === "55555555555" ||
//     cpfNumerico === "66666666666" || cpfNumerico === "77777777777" || cpfNumerico === "88888888888" ||
//     cpfNumerico === "99999999999") {
//     return 'CPF inválido.';
//   }

//   // Cálculo do primeiro dígito verificador
//   for (let i = 1; i <= 9; i++) {
//     soma += parseInt(cpfNumerico.substring(i - 1, i)) * (11 - i);
//   }
//   resto = (soma * 10) % 11;
//   if ((resto === 10) || (resto === 11)) resto = 0;
//   if (resto !== parseInt(cpfNumerico.substring(9, 10))) {
//     return 'CPF inválido.';
//   }

//   // Cálculo do segundo dígito verificador
//   soma = 0;
//   for (let i = 1; i <= 10; i++) {
//     soma += parseInt(cpfNumerico.substring(i - 1, i)) * (12 - i);
//   }
//   resto = (soma * 10) % 11;
//   if ((resto === 10) || (resto === 11)) resto = 0;
//   if (resto !== parseInt(cpfNumerico.substring(10, 11))) {
//     return 'CPF inválido.';
//   }

//   return '';
// }

// Função geral de validação que retorna os erros
export const validarFormulario = (formData) => {
  const erros = {};

  const perfil = formData.perfil;
  const erroEmail = validarEmail(formData.email);
  if (erroEmail) erros.email = erroEmail;
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
