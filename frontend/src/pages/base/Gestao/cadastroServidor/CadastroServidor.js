import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import servidorService from '../../../../services/servidorService';
import Button from '../../../../components/Button/Button';
import { toast, ToastContainer } from 'react-toastify';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import "./CadastroServidor.css";
import { validarFormulario, validarCampo } from './validacoes';

const CadastroServidor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { servidor } = location.state || {};  // Recupera os dados do servidor passados via navegação
    console.log(servidor);
    const [formData, setFormData] = useState({
        grupo: servidor?.grupo || 'Professor',  // Usa dados do servidor se estiverem disponíveis
        email: servidor?.email || '',
    });
    const [isEditing, setIsEditing] = useState(!!servidor); // Define se é edição ou cadastro
    const [errors, setErrors] = useState({});
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const grupoMap = {
        // ID de cada grupo (de acordo com o auth.group)
        'GestaoEscolar': 1,
        'Coordenador': 3,
        'RegistroEscolar': 4,
        'Professor': 5,
    };

    useEffect(() => {
        if (servidor) {
            setIsEditing(true);
            setFormData({
                grupo: servidor.grupo,
                email: servidor.email,
            });
        } else {
            setIsEditing(false); // Se não há servidor, é um cadastro novo
        }
    }, [servidor]);

    const enviarHandler = async (e) => {
        e.preventDefault();
        const { grupo, email } = formData;

        const grupoId = grupoMap[grupo];

        const dataToSend = { grupo: grupoId, email };

        const validationErrors = validarFormulario(dataToSend);

        if (Object.keys(validationErrors).length !== 0) {
            setErrors(validationErrors)
            setShowErrorMessage(true);

        } else {
            try {
                if (isEditing) {
                    // Atualiza o servidor existente
                    const response = await servidorService.editar(servidor.id, dataToSend);
                    if (response.ok) {
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

                        navigate('/sessao/GestaoEscolar/2/listaServidor/${servidor.id}/detalhesServidor');

                    } else {
                        throw new Error('Erro ao editar o servidor');
                    }

                } else {
                    // Cria um novo servidor
                    const response = await servidorService.create(dataToSend, 'csrftoken');
                    if (response.ok) {
                        toast.success(`Novo ${grupo} cadastrado com sucesso!`, {
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

                        navigate('/sessao/GestaoEscolar/2/listaServidor/${servidor.id}/detalhesServidor');
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
            <ToastContainer />
            <FormContainer titulo={isEditing ? 'Editar Servidor' : 'Cadastrar Servidor'} onSubmit={enviarHandler}>
                {showErrorMessage && <p style={{ color: 'red' }}>* Preencha os campos obrigatórios</p>}
                <span className='spanCadastroServidor'>Perfil</span>
                <div className="radio-container">
                    <label className='labelRadioCadastroServidor' htmlFor='Professor'>
                        <input className='radioCadastroServidor' id='Professor' type="radio" name='grupo' value="Professor" checked={formData.grupo === 'Professor'}
                            onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                        />
                        <span className='spanRadioCadastroServidor'>Professor</span>
                    </label>
                    <label className='labelRadioCadastroServidor' htmlFor='RegistroEscolar'>
                        <input className='radioCadastroServidor' id='RegistroEscolar' type="radio" name='grupo' value="RegistroEscolar" checked={formData.grupo === 'RegistroEscolar'}
                            onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                        />
                        <span className='spanRadioCadastroServidor'>Registros Escolares</span>
                    </label>
                    <label className='labelRadioCadastroServidor' htmlFor='GestaoEscolar'>
                        <input className='radioCadastroServidor' id='GestaoEscolar' type="radio" value="GestaoEscolar" name='grupo' checked={formData.grupo === 'GestaoEscolar'}
                            onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                        />
                        <span className='spanRadioCadastroServidor'>Gestão Escolar</span>
                    </label>
                    <label className='labelRadioCadastroServidor' name='Coordenador' htmlFor='Coordenador'>
                        <input className='radioCadastroServidor' id='Coordenador' name='grupo' type="radio" value="Coordenador" checked={formData.grupo === 'Coordenador'}
                            onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                        />
                        <span className='spanRadioCadastroServidor'>Coordenador</span>
                    </label>
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
