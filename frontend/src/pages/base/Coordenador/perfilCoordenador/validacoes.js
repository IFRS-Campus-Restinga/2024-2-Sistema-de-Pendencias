const validarMatricula = (matricula) => {
    if (!matricula) {
        return 'Campo obrigatório';
    }
    if (matricula.length < 8) {
        return 'A matrícula SIAPE deve conter 8 digitos';
    }

    return '';
};

const validarCPF = (cpf) => {

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return "Campo obrigatório";
    }

    const calcularDigito = (parte) => {
        let soma = 0;
        for (let i = 0; i < parte.length; i++) {
            soma += parseInt(parte[i]) * (parte.length + 1 - i);
        }
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    const primeiroDigito = calcularDigito(cpf.substring(0, 9));
    const segundoDigito = calcularDigito(cpf.substring(0, 9) + primeiroDigito);

    if (primeiroDigito !== parseInt(cpf[9]) || segundoDigito !== parseInt(cpf[10])) return "CPF Inválido!"

    return ""
}
  
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