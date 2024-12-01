const validarMatricula = (matricula) => {
  if (!matricula) {
      return 'Campo obrigatório';
  }
  if (matricula.length < 8) {
      return 'A matrícula SIAPE deve conter 8 digitos';
  }
  if (matricula == 0){
      return 'A matrícula SIAPE deve ser maior que 0';
  }

  return '';
};

// Validação para o campo "CPF"
export const validarCPF = (cpf) => {
const cpfRegex = /^\d{11}$/; // Verifica se o CPF tem 11 dígitos numéricos

// Verifica se o campo está vazio
if (!cpf) {
  return 'Campo obrigatório.';
}

// Verifica se o CPF contém 11 dígitos numéricos
if (!cpfRegex.test(cpf)) {
  return 'CPF deve conter 11 dígitos.';
}

// Verifica se o CPF é válido
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
};

// Função geral de validação que retorna os erros
export const validarFormulario = (formData) => {
const erros = {};

const erroMatricula = validarMatricula(formData.matricula);
if (erroMatricula) erros.matricula = erroMatricula;

const erroCPF = validarCPF(formData.cpf)
if (erroCPF) erros.cpf = erroCPF

return erros;
};

// Função para validar um campo específico
export const validarCampo = (campo, valor) => {
  switch (campo) {
    case 'matricula':
      return validarMatricula(valor);
    case 'cpf':
      return validarCPF(valor);
    default:
      return '';
  }
};