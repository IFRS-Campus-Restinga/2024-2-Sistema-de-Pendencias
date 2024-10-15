// src/utils/validacoes.js

// Validação para o campo "nome"
export const validarNome = (nome) => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,100}$/;
  if (!nome) {
    return 'Campo obrigatório.';
  }
  if (!nameRegex.test(nome)) {
    return 'Nome deve conter de 3 a 100 caracteres e aceitar apenas letras.';
  }
  return '';
};

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

// Validação para o campo "matrícula"
export const validarMatricula = (matricula) => {
  const matriculaRegex = /^\d{10}$/;
  if (!matricula) {
    return 'Campo obrigatório.';
  }
  if (!matriculaRegex.test(matricula)) {
    return 'Matrícula inválida';
  }
  return '';
};

// Validação para o campo "cpf"
export const validarCPF = (cpf) => {
  const cpfRegex = /^\d{11}$/;

  if (!cpf) {
    return 'Campo obrigatório.';
  }

  if (!cpfRegex.test(cpf)) {
    return 'CPF deve conter 11 dígitos.';
  }
  // Verifica se o CPF é válido com o algoritmo de validação
  let soma = 0;
  let resto;

  // CPF inválidos conhecidos
  if (cpf === "00000000000" || cpf === "11111111111" || cpf === "22222222222" ||
    cpf === "33333333333" || cpf === "44444444444" || cpf === "55555555555" ||
    cpf === "66666666666" || cpf === "77777777777" || cpf === "88888888888" ||
    cpf === "99999999999") {
    return 'CPF inválido.';
  }

  // Cálculo do primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) {
    return 'CPF inválido.';
  }

  // Cálculo do segundo dígito verificador
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) {
    return 'CPF inválido.';
  }

  return '';
}

// Função geral de validação que retorna os erros
export const validarFormulario = (formData) => {
  const erros = {};

  const perfil = formData.perfil;
  if (perfil === 'Professor'){
    const erroMatricula = validarMatricula(formData.matricula);
    if (erroMatricula) erros.matricula = erroMatricula;

    const erroCpf = validarCPF(formData.cpf);
    if (erroCpf) erros.cpf = erroCpf;
  }
  const erroNome = validarNome(formData.nome);
  if (erroNome) erros.nome = erroNome;

  const erroEmail = validarEmail(formData.email);
  if (erroEmail) erros.email = erroEmail;
  return erros;
};

// Função para validar um campo específico
export const validarCampo = (campo, valor) => {
  switch (campo) {
    case 'nome':
      return validarNome(valor);
    case 'email':
      return validarEmail(valor);
    case 'matricula':
      return validarMatricula(valor);
    case 'cpf':
      return validarCPF(valor)
    default:
      return '';
  }
};
