// src/utils/validacoes.js

// Validação para o campo "nome"
export const validarNome = (nome) => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,100}$/;
  const palavras = nome.trim().split(/\s+/); // Divide o nome em palavras
  if (!nome) {
    return 'Campo obrigatório.';
  }
  if (!nameRegex.test(nome)) {
    return 'Nome deve conter de 3 a 100 caracteres e apenas letras.';
  }
  if (palavras.length < 2) {
    return 'Nome deve conter nome e sobrenome';
  }
  if (palavras.some(word => word.length < 3)) {
    return 'Nome inválido';
  }
  return '';
};

// Validação para o campo "email"
export const validarEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dominioPermitido = /@(aluno\.restinga\.ifrs\.edu\.br|restinga\.ifrs\.edu\.br)$/;
  if (!email) {
    return 'Campo obrigatório';
  }
  if (!emailRegex.test(email) || !dominioPermitido.test(email)) {
    return 'Email inválido';
  }
  return '';
};

// Validação para o campo "matrícula"
export const validarMatricula = (matricula) => {
  const matriculaRegex = /^\d{8,10}$/;
  if (!matricula) {
    return 'Campo obrigatório.';
  }
  if (!matriculaRegex.test(matricula)) {
    return 'Matrícula inválida';
  }
  return '';
};

// Função para validar se o e-mail corresponde à matrícula
const validarEmailComMatricula = (email, matricula) => {
  const parteEmail = email.split('@')[0];
  if (parteEmail !== matricula) {
    return 'E-mail deve estar vinculado a matrícula.';
  }
  return '';
};

// Função geral de validação que retorna os erros
export const validarFormulario = (formData) => {
  const erros = {};

  const erroNome = validarNome(formData.nome);
  if (erroNome) erros.nome = erroNome;

  const erroEmail = validarEmail(formData.email);
  if (erroEmail) erros.email = erroEmail;

  const erroMatricula = validarMatricula(formData.matricula);
  if (erroMatricula) erros.matricula = erroMatricula;

  const erroEmailMatricula = validarEmailComMatricula(formData.email, formData.matricula);
  if (erroEmailMatricula) erros.email = erroEmailMatricula;

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
    default:
      return '';
  }
};
