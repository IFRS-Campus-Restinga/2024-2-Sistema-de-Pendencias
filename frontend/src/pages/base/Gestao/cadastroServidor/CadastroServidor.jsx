import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import { toast, ToastContainer } from 'react-toastify';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import styles from "./CadastroServidor.module.css";
import { UsuarioService } from '../../../../services/usuarioService';
import { validarEmailServidor } from '../../../../utils/validacoes';
import Label from '../../../../components/Label/Label';
import MensagemErro from '../../../../components/MensagemErro/MensagemErro';

const CadastroServidor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location || {};  // Recupera os dados do servidor passados via navegação
    const [formData, setFormData] = useState({
        grupo: state?.grupo || 'Professor',  // Usa dados do servidor se estiverem disponíveis
        email: state?.email || '',
    });
    const [errors, setErrors] = useState({
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

    const enviarHandler = async (e) => {
        e.preventDefault();
        const erros = validarForm()

        if (erros === '') {
            let registroServidor
            if (!state) {
                registroServidor = UsuarioService.criar(formData)
            } else {
                registroServidor = UsuarioService.editar(formData)
            }

            toast.promise(
                registroServidor,
                {
                    pending: state ? 'Salvando alterações...' : 'Realizando cadastro...',
                    success: 'Registro realizado com sucesso!',
                    error: {
                        render({ data }) {
                            return data instanceof Error ? data.message : "Erro ao cadastrar usuário";
                        }
                    }
                },
                {
                    position: 'bottom-center',
                    autoClose: 3000,
                    style: { textAlign: 'center' }
                }
            )

            try {
                const res = await registroServidor

                if (res.status !== 201 && res.status !== 200) throw new Error(res.mensagem)

                setErrors({ email: '' });
                setFormData({ ...formData, email: '' });
            } catch (error) {
                console.error(error.message)
            }
        } else {
            setErrors({ email: erros })
        }
    };

    const validarForm = () => {
        return validarEmailServidor(formData.email)
    }

    useEffect(() => {
        fetchGrupos()
        if (state) {
            setFormData({
                grupo: state.grupo,
                email: state.email,
            });
        }
    }, [state]);

    return (
        <>
            <ToastContainer />
            <FormContainer titulo={state ? 'Editar Servidor' : 'Cadastrar Servidor'} onSubmit={enviarHandler} textoInfo={'Selecione um perfil e em seguida digite o email institucional do servidor a ser cadastrado\n\nCada servidor pode ser registrado apenas uma vez no sistema'}>
                {errors.email !== '' ? <MensagemErro mensagem={'* Preencha os campos obrigatórios'} /> : null}
                <span className={styles.span}>Perfil</span>
                <div className={styles.radioContainer}>
                    {
                        grupos.map((grupo) => (
                            grupo.name !== 'Aluno' ? (
                                <label className={styles.labelRadio} htmlFor={grupo}>
                                    <input className={styles.radio} id={grupo} type="radio" name='grupo' value={grupo} checked={formData.grupo === grupo}
                                        onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                                    />
                                    <span className={styles.spanGrupo}>{grupo}</span>
                                </label>
                            ) : (
                                <></>
                            )
                        ))
                    }
                </div>
                <div className={styles.container}>
                    <Label titulo={'Email'}>
                        <Input
                            typo='email'
                            valor={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onBlur={() => setErrors({ ...errors, email: validarEmailServidor(formData.email) })}
                            erro={errors.email}
                        />
                        {errors.email !== '' ? <MensagemErro mensagem={errors.email} /> : null}
                    </Label>
                    <Button tipo='submit' texto={state ? 'Salvar Alterações' : 'Cadastrar Servidor'} />
                </div>
            </FormContainer>
        </>
    );
};

export default CadastroServidor;
