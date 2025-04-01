
export const validarMatricula = (matricula) => {
    const regexMatricula = /^\d{10}$/

    if (!matricula || matricula.trim().length === 0) return 'Campo obrigatório'
    if (!regexMatricula.test(matricula)) return 'Matrícula inválida'

    return ''
}

export const validarEmailAluno = (email) => {
    const regexEmail = /^\d{10}@aluno\.restinga\.ifrs\.edu\.br$/;

    if(!email || email.trim().length === 0) return 'Campo obrigatório'
    if (!regexEmail.test(email)) return 'Email inválido'

    return ''
}

export const validarEmail_Matricula = (email, matricula) => {
    if (email) {
        const emailMatricula = email.split('@')[0]

        if (emailMatricula !== matricula) return 'Título do email e matricula devem ser iguais'

        return ''
    }
}

export const validarEmailServidor = (email) => {
    const regexEmail = /^[^@]+@+restinga\.ifrs\.edu\.br$/;

    if(!email || email.trim().length === 0) return 'Campo obrigatório'
    if (!regexEmail.test(email)) return 'Email inválido'

    return ''
}

export const validarNome = (nome) => {
    if (!nome || nome.trim().length === 0) return 'Campo obrigatório'

    return ''
}

export const validarCPF = (cpf) => {
    if (!cpf || cpf.trim().length === 0) return 'Campo obrigatório';

    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) return 'CPF inválido';

    if (/^(\d)\1{10}$/.test(cpfLimpo)) return 'CPF inválido';

    const calcularDigito = (base) => {
        let soma = 0;
        let peso = base.length + 1;

        for (let i = 0; i < base.length; i++) {
            soma += parseInt(base[i]) * peso--;
        }

        let resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    const primeiroDigito = calcularDigito(cpfLimpo.slice(0, 9));
    const segundoDigito = calcularDigito(cpfLimpo.slice(0, 10));

    if (
        primeiroDigito !== parseInt(cpfLimpo[9]) ||
        segundoDigito !== parseInt(cpfLimpo[10])
    ) {
        return 'CPF inválido';
    }

    return '';
};

export const validarTelefone = (telefone) => {
    if (!telefone || telefone.trim().length === 0) return 'Campo obrigatório';

    const telefoneLimpo = telefone.replace(/\D/g, '');

    if (telefoneLimpo.length !== 10 && telefoneLimpo.length !== 11) {
        return 'Telefone inválido';
    }

    const ddd = telefoneLimpo.substring(0, 2);
    if (!/^[1-9][0-9]$/.test(ddd)) return 'DDD inválido';

    if (telefoneLimpo.length === 11 && telefoneLimpo[2] !== '9') {
        return 'Número de celular inválido';
    }

    return '';
};

export const validarData = (data) => {
    if (!data || data.trim().length === 0) return 'Campo obrigatório'

    return ''
}

