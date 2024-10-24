import React, { useState } from 'react';
import servidorService from '../../../../services/servidorService';
import "./CadastroServidor.css";
import Button from '../../../../components/Button/Button';
import { validarFormulario, validarCampo } from './validacoes';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import FormContainer from '../../../../components/FormContainer/FormContainer';

const CadastroServidor = () => {
    const [formData, setFormData] = useState({
        perfil: '',
        email: ''
    });

    const [errors, setErrors] = useState({});
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const enviarHandler = async (e) => {
        e.preventDefault();
        // Crie um objeto a ser enviado, incluindo apenas os campos necessários
        const { perfil, email } = formData;
        const dataToSend = {
            perfil,
            email,
        };
        
        try {
            // valida o formulário
            const validationErrors = validarFormulario(dataToSend);

            console.log(dataToSend)

            if (Object.keys(validationErrors).length !== 0) {
                setErrors(validationErrors)
                setShowErrorMessage(true);
                throw new Error(validationErrors)
            }
            
            const response = await servidorService.create(dataToSend, 'csrftoken');

            if (response.status !== 201) throw new Error(response.erro)

            toast.success(`Novo ${perfil} cadastrado com sucesso!`, {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#28A745', color: '#fff' },
                progressStyle: { backgroundColor: '#fff' }
            });

            // Limpar o formulário após o sucesso
            setFormData({
                perfil: '',
                email: '',
            });
            setErrors({}); // Limpar os erros também
        } catch (erro) {
            setErrors(erro);
            setShowErrorMessage(true);
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
        <ToastContainer/>
        <FormContainer titulo='Cadastro Servidor' onSubmit={enviarHandler}>
                <span className='spanCadastroServidor'>Perfil</span>
                <div className="radio-container">
                    <label className='labelCadastroServidor' htmlFor='Professor'>
                        <input className='radioCadastroServidor' id='Professor' type="radio" name='perfil' value="Professor" checked={formData.perfil === 'Professor'}
                            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                        />
                        <span className='spanRadioCadastroServidor'>Professor</span>
                    </label>
                    <label className='labelCadastroServidor' htmlFor='RegistroEscolar'>
                        <input className='radioCadastroServidor' id='RegistroEscolar' type="radio" name='perfil' value="RegistroEscolar" checked={formData.perfil === 'RegistroEscolar'}
                            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                        />
                        <span className='spanRadioCadastroServidor'>Registros Escolares</span>
                    </label>
                    <label className='labelCadastroServidor' htmlFor='GestaoEscolar'>
                        <input className='radioCadastroServidor' id='GestaoEscolar' type="radio" value="GestaoEscolar" name='perfil' checked={formData.perfil === 'GestaoEscolar'}
                            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                        />
                        <span className='spanRadioCadastroServidor'>Gestão Escolar</span>
                    </label>
                    <label className='labelCadastroServidor' name='Coordenador' htmlFor='Coordenador'>
                        <input className='radioCadastroServidor' id='Coordenador' name='perfil' type="radio" value="Coordenador" checked={formData.perfil === 'Coordenador'}
                            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                        />
                        <span className='spanRadioCadastroServidor'>Coordenador</span>
                    </label>
                </div>
            <div className="form-item">
                <label>E-mail</label>
                <input type="email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
                    onBlur={() => validarHandler('email')}
                    placeholder="E-mail"
                    style={{ borderColor: errors.nome ? 'red' : '' }}
                />
                {errors.email && <p className="erros">{errors.email}</p>}
            </div>
            {showErrorMessage && <p style={{ color: 'red' }}>* Preencha os campos obrigatórios</p>}
        </FormContainer>
        </>
    );
};

export default CadastroServidor;
