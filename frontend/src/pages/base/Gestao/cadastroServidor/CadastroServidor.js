import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import servidorService from '../../../../services/servidorService';
import Button from '../../../../components/Button/Button';
import { toast, ToastContainer } from 'react-toastify';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import "./CadastroServidor.css";
import { validarFormulario, validarCampo } from './validacoes';
import { usuarioBaseService } from '../../../../services/usuarioBaseService';

const CadastroServidor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location || {};  // Recupera os dados do servidor passados via navegação
    const [formData, setFormData] = useState({
        grupo: state?.grupo || 'Professor',  // Usa dados do servidor se estiverem disponíveis
        email: state?.email || '',
    });
    const [isEditing, setIsEditing] = useState(!!state); // Define se é edição ou cadastro
    const [errors, setErrors] = useState({});
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [grupos, setGrupos] = useState([])

    const fetchGrupos = async () => {
        try {
            const res = await usuarioBaseService.listarGrupos()

            if (res.status !== 200) throw new Error(res)

            setGrupos(res.data)
        } catch (erro) {
            console.error(erro)
        }
    }

    useEffect(() => {
        fetchGrupos()
        if (state) {
            setIsEditing(true);
            setFormData({
                grupo: state.grupo,
                email: state.email,
            });
        } else {
            setIsEditing(false); // Se não há servidor, é um cadastro novo
        }
    }, [state]);

    const enviarHandler = async (e) => {
        e.preventDefault();

        const validationErrors = validarFormulario(formData);

        if (Object.keys(validationErrors).length !== 0) {
            setErrors(validationErrors)
            setShowErrorMessage(true);

        } else {
            try {
                if (isEditing) {
                    const response = await servidorService.editar(state.id, formData);

                    if (response) {
                        toast.success(`Servidor atualizado com sucesso!`, {
                            position: "bottom-center",
                            autoClose: 3000,
                            style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
                            progressStyle: { backgroundColor: '#fff' }
                        });

                        // Limpar o formulário após o sucesso
                        setFormData({
                            grupo: 'Professor',
                            email: '',
                        });
                        setErrors({}); // Limpar os erros também

                        navigate(`/sessao/Gestão Escolar/2/servidores`);

                    } else {
                        throw new Error('Erro ao editar o servidor');
                    }

                } else {
                    // Cria um novo servidor
                    const response = await usuarioBaseService.criar(formData);

                    if (response.status === 201) {
                        toast.success(`Novo usuário cadastrado com sucesso!`, {
                            position: "bottom-center",
                            autoClose: 3000,
                            style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
                            progressStyle: { backgroundColor: '#fff' }
                        });

                        // Limpar o formulário após o sucesso
                        setFormData({
                            grupo: 'Professor',
                            email: '',
                        });
                        setErrors({}); // Limpar os erros também
                    } else {
                        throw new Error('Erro ao cadastrar o servidor');

                    }
                }
            } catch (error) {
                console.error("Erro:",error.message);
                toast.error('Falha ao salvar o servidor.');
            }
        }
    };

    const validarHandler = (campo) => {
        let valorCampo = formData[campo];

        // Remover formatação do CPF antes de validar
        if (campo === 'cpf') {
            valorCampo = valorCampo.replace(/\D/g, '');
        }

        const error = validarCampo(campo, valorCampo);
        if (error) {
            setErrors((prevErrors) => ({ ...prevErrors, [campo]: error }));
        } else {
            setErrors((prevErrors) => {
                const { [campo]: removed, ...rest } = prevErrors;
                return rest;
            });
        }
    };

    return (
        <>
            <FormContainer titulo={isEditing ? 'Editar Servidor' : 'Cadastrar Servidor'} onSubmit={enviarHandler}>
            <ToastContainer /> 
                {showErrorMessage && <p style={{ color: 'red' }}>* Preencha os campos obrigatórios</p>}
                <span className='spanCadastroServidor'>Perfil</span>
                <div className="radio-container">
                    {
                        grupos.map((grupo) => (
                            grupo.name !== 'Aluno' ? (
                                <label className='labelRadioCadastroServidor' htmlFor={grupo.name}>
                                    <input className='radioCadastroServidor' id={grupo.name} type="radio" name='grupo' value={grupo.name} checked={formData.grupo === grupo.name}
                                        onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                                    />
                                    <span className='spanRadioCadastroServidor'>{grupo.name}</span>
                                </label>
                            ) : (
                                <></>
                            )
                        ))
                    }
                </div>
                <div className="form-item">
                    <label className='labelCadastroServidor'>E-mail</label>
                    <Input
                        typo='email'
                        valor={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onBlur={() => validarHandler('email')}
                        erro={errors.email}
                    />
                    {errors.email && <p className="erros">{errors.email}</p>}
                </div>

                <Button tipo='submit' text={isEditing ? 'Salvar Alterações' : 'Cadastrar Servidor'} />
            </FormContainer>
        </>
    );
};

export default CadastroServidor;
