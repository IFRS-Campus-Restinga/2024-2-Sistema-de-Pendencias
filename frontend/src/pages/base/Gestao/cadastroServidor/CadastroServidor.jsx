import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import { toast, ToastContainer } from 'react-toastify';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import styles from "./CadastroServidor.module.css";
import { UsuarioService } from '../../../../services/usuarioService';
import { validarCPF, validarEmailServidor, validarMatriculaServidor, validarNome } from '../../../../utils/validacoes';
import Label from '../../../../components/Label/Label';
import MensagemErro from '../../../../components/MensagemErro/MensagemErro';
import Switch from '../../../../components/Switch/Switch';

const CadastroServidor = () => {
    const location = useLocation();
    const { state } = location || {};
    const [ativo, setAtivo] = useState()
    const [servidor, setServidor] = useState()
    const [formData, setFormData] = useState({
        grupo: 'Professor',
        email: '',
    });
    const [erros, setErros] = useState({
        email: ''
    });
    const [grupos, setGrupos] = useState([])

    const fetchGrupos = async () => {
        try {
            const res = await UsuarioService.listarGrupos()

            if (res.status !== 200) throw new Error(res)

            setGrupos(res.data)
        } catch (erro) {
            console.error(erro)
        }
    }

    const fetchServidor = async () => {
        try {
            const res = await UsuarioService.porId(state)

            if (res.status !== 200) throw new Error(res.statusText)

            setFormData(res.data)
            setServidor(res.data)
            setAtivo(res.data.is_active ? 'Ativo' : 'Inativo')
        } catch (error) {
            console.error(error.message)
        }
    }

    const enviarHandler = async (e) => {
        e.preventDefault();

        if (validarForm()) {
            let registroServidor
            if (state) {
                registroServidor = UsuarioService.editar(state, formData)
            } else {
                registroServidor = UsuarioService.criar(formData)
            }

            toast.promise(
                registroServidor,
                {
                    pending: 'Realizando cadastro...',
                    success: 'Registro realizado com sucesso!',
                    error: {
                        render({ data }) {
                            if (data instanceof Error) {
                                const parsedError = JSON.parse(data.message);
                                return Object.values(parsedError).join('\n'); // ← mostra todas as mensagens num único toast
                            }
                            return 'Erro ao cadastrar usuário';
                        }
                    }
                },
                {
                    position: 'bottom-center',
                    autoClose: 3000,
                    style: { textAlign: 'center', whiteSpace: 'pre-line' } // quebra de linha se tiver \n
                }
            );


            try {
                const res = await registroServidor

                if (res.status !== 201) throw new Error(res.mensagem)

                setErros({ email: '' });
                setFormData({ ...formData, email: '' });
            } catch (error) {
                console.error(error.message)
            }
        }
    };

    const validarForm = () => {
        let erro
        let validado = true

        if (state) {
            if (formData.grupo === 'Professor') {
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
                            erro = validarEmailServidor(formData.email)
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
                            erro = validarMatriculaServidor(formData.matricula)
                            if (erro !== '') {
                                setErros({ ...erros, matricula: erro })
                                validado = false
                            }
                            break;
                        default:
                            break;
                    }
                }

                return validado
            } else {
                let erro
                let validado = true

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
                            erro = validarEmailServidor(formData.email)
                            if (erro !== '') {
                                setErros({ ...erros, email: erro })
                                validado = false
                            }
                            break;
                        default:
                            break;
                    }
                }

                return validado
            }
        } else {
            let erro
            let validado = true

            erro = validarEmailServidor(formData.email)

            if (erro !== '') {
                setErros({ ...erros, email: erro })
                validado = false
            }

            return validado
        }
    }

    useEffect(() => {
        fetchGrupos()
        if (state) {
            fetchServidor()
        }
    }, [state]);

    return (
        <>
            <ToastContainer />
            <FormContainer titulo={state ? 'Editar Servidor' : 'Cadastrar Servidor'} onSubmit={enviarHandler} textoInfo={'Selecione um perfil e em seguida digite o email institucional do servidor a ser cadastrado\n\nCada servidor pode ser registrado apenas uma vez no sistema'}>
                {erros.email !== '' ? <MensagemErro mensagem={'* Preencha os campos obrigatórios'} /> : null}
                {
                    state ? (
                        <div className={styles.switchContainer}>
                            <Switch
                                stateHandler={(novoValor) => {
                                    setAtivo(novoValor);
                                    setFormData({ ...formData, is_active: novoValor === "Ativo" });
                                }}
                                valor1="Inativo"
                                valor2="Ativo"
                                valor={ativo}
                            />
                        </div>
                    ) : (
                        <></>
                    )
                }
                {
                    !servidor?.matricula || !servidor?.cpf ? (
                        <>
                        </>
                    ) : (
                        <>
                            <span className={styles.span}>Perfil</span>
                            <div className={styles.radioContainer}>
                                {
                                    grupos.map((grupo) => (
                                        grupo.name !== 'Aluno' ? (
                                            <label className={styles.labelRadio} htmlFor={grupo}>
                                                <input className={styles.radio} id={grupo} type="radio" name='grupo' value={grupo} checked={formData.grupo === grupo}
                                                    onChange={(e) => setFormData({ ...servidor, grupo: e.target.value })}
                                                />
                                                <span className={styles.spanGrupo}>{grupo}</span>
                                            </label>
                                        ) : (
                                            <></>
                                        )
                                    ))
                                }
                            </div>
                        </>
                    )
                }
                <div className={styles.container}>
                    {
                        !state ? (
                            <Label titulo={'Email'}>
                                <Input
                                    tipo='email'
                                    valor={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onBlur={() => setErros({ ...erros, email: validarEmailServidor(formData.email) })}
                                    erro={erros.email}
                                />
                                {erros?.email !== '' ? <MensagemErro mensagem={erros.email} /> : null}
                            </Label>
                        ) : formData.grupo === 'Professor' ? (
                            <>
                                <div className={styles.formGroup}>
                                    <Label titulo={'Nome'}>
                                        <Input
                                            tipo={'text'}
                                            valor={formData.nome ?? ''}
                                            onChange={(e) => {
                                                if (isNaN(Number(e.target.value))) setFormData({ ...formData, nome: e.target.value })
                                            }}
                                            onBlur={() => setErros({ ...erros, nome: validarNome(formData.nome) })}
                                            erro={erros.nome}
                                        />
                                        {erros?.nome !== '' ? <MensagemErro mensagem={erros.nome} /> : null}
                                    </Label>
                                    <Label titulo={'Email'}>
                                        <Input
                                            tipo='email'
                                            valor={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            onBlur={() => setErros({ ...erros, email: validarEmailServidor(formData.email) })}
                                            erro={erros.email}
                                        />
                                        {erros?.email !== '' ? <MensagemErro mensagem={erros.email} /> : null}
                                    </Label>
                                </div>
                                <div className={styles.formGroup}>
                                    <Label titulo={'CPF'}>
                                        <Input
                                            tipo={'text'}
                                            valor={formData.cpf ?? ''}
                                            max={11}
                                            onChange={(e) => {
                                                if (!isNaN(Number(e.target.value))) setFormData({ ...formData, cpf: e.target.value })
                                            }}
                                            onBlur={() => setErros({ ...erros, cpf: validarCPF(formData.cpf) })}
                                            erro={erros.cpf}
                                        />
                                        {erros?.cpf !== '' ? <MensagemErro mensagem={erros.cpf} /> : null}
                                    </Label>
                                    <Label titulo={'Matricula'}>
                                        <Input
                                            tipo='text'
                                            max={7}
                                            valor={formData.matricula}
                                            onChange={(e) => {
                                                if (!isNaN(Number(e.target.value))) setFormData({ ...formData, matricula: e.target.value })
                                            }}
                                            onBlur={() => setErros({ ...erros, matricula: validarMatriculaServidor(formData.matricula) })}
                                            erro={erros.matricula}
                                        />
                                        {erros?.matricula !== '' ? <MensagemErro mensagem={erros.matricula} /> : null}
                                    </Label>
                                </div>
                            </>
                        ) : formData.grupo !== 'Professor' ? (
                            <>
                                <Label titulo={'Nome'}>
                                    <Input
                                        tipo={'text'}
                                        valor={formData.nome ?? ''}
                                        onChange={(e) => {
                                            if (isNaN(Number(e.target.value))) setFormData({ ...formData, nome: e.target.value })
                                        }}
                                        onBlur={() => setErros({ ...erros, nome: validarNome(formData.nome) })}
                                        erro={erros.nome}
                                    />
                                    {erros?.nome !== '' ? <MensagemErro mensagem={erros.nome} /> : null}
                                </Label>
                                <Label titulo={'Email'}>
                                    <Input
                                        tipo='email'
                                        valor={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        onBlur={() => setErros({ ...erros, email: validarEmailServidor(formData.email) })}
                                        erro={erros.email}
                                    />
                                    {erros?.email !== '' ? <MensagemErro mensagem={erros.email} /> : null}
                                </Label>
                            </>
                        ) : (
                            <></>
                        )
                    }
                </div>
                <Button tipo='submit' texto={state ? 'Salvar Alterações' : 'Cadastrar Servidor'} />
            </FormContainer>
        </>
    );
};

export default CadastroServidor;
