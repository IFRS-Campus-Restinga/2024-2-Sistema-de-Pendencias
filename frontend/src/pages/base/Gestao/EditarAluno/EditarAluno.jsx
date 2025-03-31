import styles from './EditarAluno.module.css'
import { ToastContainer, toast } from 'react-toastify';
import FormContainer from "../../../../components/FormContainer/FormContainer";
import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom"
import { UsuarioService } from '../../../../services/usuarioService';
import LoadingIFRS from '../../../../components/LoadingIFRS/LoadingIFRS';
import Label from '../../../../components/Label/Label';
import Input from '../../../../components/Input/Input';
import { validarCPF, validarData, validarEmailAluno, validarMatricula, validarNome, validarTelefone } from '../../../../utils/validacoes';
import MensagemErro from '../../../../components/MensagemErro/MensagemErro';
import { getDataMaxima } from '../../../../utils/datas';
import Button from '../../../../components/Button/Button';
import Switch from '../../../../components/Switch/Switch';



const EditarAluno = () => {
    const location = useLocation()
    const { state } = location
    const [carregando, setCarregando] = useState(true)
    const [active, setActive] = useState('Ativo')
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        matricula: '',
        cpf: '',
        telefone: '',
        data_nascimento: '',
        is_active: true,

    })
    const [erros, setErros] = useState({
        nome: '',
        email: '',
        matricula: '',
        cpf: '',
        telefone: '',
        data_nascimento: '',
        is_active: active === 'Ativo' ? true : false,

    })

    const validarForm = () => {
        let validado = true
        let erro
        for (let campo in formData) {
            switch (campo) {
                case 'nome':
                    erro = validarNome(formData.nome)
                    if (erro !== '') {
                        setErros({ ...erros, nome: erro })
                        validado = false
                    }
                    break;
                case 'email':
                    erro = validarEmailAluno(formData.email)
                    if (erro !== '') {
                        setErros({ ...erros, email: erro })
                        validado = false
                    }
                    break;
                case 'cpf':
                    erro = validarCPF(formData.cpf)
                    if (erro !== '') {
                        setErros({ ...erros, cpf: erro })
                        validado = false
                    }
                    break;
                case 'matricula':
                    erro = validarMatricula(formData.matricula)
                    if (erro !== '') {
                        setErros({ ...erros, matricula: erro })
                        validado = false
                    }
                    break;
                case 'telefone':
                    erro = validarTelefone(formData.telefone)
                    if (erro !== '') {
                        setErros({ ...erros, telefone: erro })
                        validado = false
                    }
                    break;
                case 'data':
                    erro = validarData(formData.data_nascimento)
                    if (erro !== '') {
                        setErros({ ...erros, data_nascimento: erro })
                        validado = false
                    }
                    break;
                default:
                    break;
            }
        }

        return validado
    }

    const fetchAluno = async () => {
        try {
            const res = await UsuarioService.porId(state)

            setFormData(res.data)
            setActive(res.data.is_active)
        } catch (error) {
            console.error(error.message)
        } finally {
            setCarregando(false)
        }
    }

    const handleEnviar = async (e) => {
        e.preventDefault()

        if (validarForm()) {
            setErros({})

            const res = UsuarioService.editar(state, formData)


            try {


            } catch (error) {

            }
        } else {

        }
    }

    useEffect(() => {
        fetchAluno()
    }, [state])

    if (carregando) return <LoadingIFRS />

    return (
        <>
            <ToastContainer />
            <FormContainer titulo={'Editar Aluno'} onSubmit={handleEnviar} textoInfo={'Preencha cada um dos campos conforme as orientações\n\nA idade mínima no campo de data é de 15 anos'}>
                <div className={styles.formGroup}>
                    <Switch stateHandler={setActive} valor1='Inativo' valor2='Ativo' valor={active} />
                </div>
                <div className={styles.formGroup}>
                    <Label titulo={'Nome'}>
                        <Input
                            max={100}
                            tipo={'text'}
                            textoAjuda={'Insira o nome do aluno'}
                            valor={formData.nome ?? ''}
                            onChange={(e) => {
                                if (isNaN(Number(e.target.value)) || e.target.value === '') setFormData({ ...formData, nome: e.target.value })
                            }}
                            onBlur={() => setErros({ ...erros, nome: validarNome(formData.nome) })}
                            erro={erros.nome}
                        />
                        {erros.nome !== '' ? (<MensagemErro mensagem={erros.nome} />) : null}
                    </Label>
                    <Label titulo={'Email'}>
                        <Input
                            max={100}
                            tipo={'text'}
                            textoAjuda={'Insira o email institucional do aluno'}
                            valor={formData.email ?? ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onBlur={() => setErros({ ...erros, email: validarEmailAluno(formData.email) })}
                            erro={erros.email}
                        />
                        {erros.email !== '' ? (<MensagemErro mensagem={erros.email} />) : null}
                    </Label>
                </div>
                <div className={styles.formGroup}>
                    <Label titulo={'CPF'}>
                        <Input
                            max={11}
                            tipo={'text'}
                            textoAjuda={'Insira o CPF do aluno (apenas números)'}
                            valor={formData.cpf ?? ''}
                            onChange={(e) => {
                                if (!isNaN(Number(e.target.value)) || e.target.value === '') setFormData({ ...formData, cpf: e.target.value })
                            }}
                            onBlur={() => setErros({ ...erros, cpf: validarCPF(formData.cpf) })}
                            erro={erros.cpf}
                        />
                        {erros.cpf !== '' ? (<MensagemErro mensagem={erros.cpf} />) : null}
                    </Label>
                    <Label titulo={'Matricula'}>
                        <Input
                            max={10}
                            tipo={'text'}
                            textoAjuda={'Insira o a matricula do aluno (apenas números)'}
                            valor={formData.matricula ?? ''}
                            onChange={(e) => {
                                if (!isNaN(Number(e.target.value)) || e.target.value === '') setFormData({ ...formData, cpf: e.target.value })
                            }}
                            onBlur={() => setErros({ ...erros, matricula: validarMatricula(formData.matricula) })}
                            erro={erros.matricula}
                        />
                        {erros.matricula !== '' ? (<MensagemErro mensagem={erros.matricula} />) : null}
                    </Label>
                </div>
                <div className={styles.formGroup}>
                    <Label titulo={'Telefone'}>
                        <Input
                            max={11}
                            tipo={'text'}
                            textoAjuda={'Insira o telefone do aluno para contato, com DDD (apenas números)'}
                            valor={formData.telefone ?? ''}
                            onChange={(e) => {
                                if (!isNaN(Number(e.target.value)) || e.target.value === '') setFormData({ ...formData, telefone: e.target.value })
                            }}
                            onBlur={() => setErros({ ...erros, telefone: validarTelefone(formData.telefone) })}
                            erro={erros.telefone}
                        />
                        {erros.telefone !== '' ? (<MensagemErro mensagem={erros.telefone} />) : null}
                    </Label>
                    <Label titulo={'Data de nascimento'}>
                        <Input
                            max={getDataMaxima()}
                            tipo={'date'}
                            valor={formData.data_nascimento ?? ''}
                            onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                            onBlur={() => setErros({ ...erros, data_nascimento: validarData(formData.data_nascimento) })}
                            erro={erros.data_nascimento}
                        />
                        {erros.data_nascimento !== '' ? (<MensagemErro mensagem={erros.data_nascimento} />) : null}
                    </Label>
                </div>
                <div className={styles.formGroup}>
                    <Button texto={'Salvar Alterações'} tipo={'submit'} />
                </div>
            </FormContainer>
        </>
    )
}

export default EditarAluno