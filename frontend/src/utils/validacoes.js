export const validarMatricula = (matricula) => {
    const regexMatricula = /^\d{10}$/

    if (!matricula || matricula.trim().length === 0) return 'Campo obrigatório'
    if (!regexMatricula.test(matricula)) return 'Matrícula inválida'

    return ''
}

export const validarMatriculaServidor = (matricula) => {
    const regexMatricula = /^\d{7,8}$/

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

export const validarCargaHoraria = (cargaHoraria) => {
    if (!cargaHoraria || cargaHoraria.toString().trim().length === 0) return 'Campo obrigatório'

    if (!/^\d+$/.test(cargaHoraria)) {
        return 'A Carga horária deve conter apenas números inteiros.';
    }

    if (Number(cargaHoraria) <= 0) {
        return 'A Carga horária de um curso deve ser maior que 0 horas';
    }

    return '';

}

export const validarTurma = (turma) => {
    const regexTurma = /^\d{3}$/
    if (!turma || turma.toString().trim().length === 0) return 'Campo obrigatório'

    if (!regexTurma.test(turma)) return 'Formato inválido'

    return ''
}

export const validarComparacaoDatas = (data1, data2, datasIguais) => {
    if (!data1 || data1 === '' || !data2 || data2 === '') return 'Campo obrigatório'

    if (data2 < data1) return 'Data final não pode ser inferior a data de início'

    if (data1 === data2 && !datasIguais) return 'As datas de início e final não podem ser iguais'

    return ''
}

export const validarHorario = (horario) => {
   if (!horario || typeof horario !== "string") return 'Campo obrigatório';
  
   const regex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
  
    if (!regex.test(horario)) return 'Formato de horário inválido';

    return ''
};

export const validarComparacaoHorario = (horario1, horario2) => {
    if (!horario1 || !horario2) return 'Horários obrigatórios';

    const regex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

    if (!regex.test(horario1) || !regex.test(horario2)) {
        return 'Formato de horário inválido';
    }

    const [h1, m1] = horario1.split(':').map(Number);
    const [h2, m2] = horario2.split(':').map(Number);

    const minutos1 = h1 * 60 + m1;
    const minutos2 = h2 * 60 + m2;

    if (minutos1 >= minutos2) {
        return 'Horário de início deve ser menor que o horário de fim';
    }

    return '';
};


