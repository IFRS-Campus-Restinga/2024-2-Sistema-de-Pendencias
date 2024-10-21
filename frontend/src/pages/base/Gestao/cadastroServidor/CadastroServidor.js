import React, { useState } from 'react';
import servidorService from '../../../../services/servidorService';
import "./CadastroServidor.css";
import Button from '../../../../components/Button/Button';
import { validarFormulario, validarCampo } from './validacoes';
import 'react-toastify/dist/ReactToastify.css';

const CadastroServidor = () => {
    const [formData, setFormData] = useState({
        perfil: '',
        email: ''
    });

    const [errors, setErrors] = useState({});
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const enviarHandler = async (e) => {
        e.preventDefault();
        const validationErrors = validarFormulario(formData);

        // const cpfSemFormatacao = formData.cpf.replace(/\D/g, '');

        // Crie um objeto a ser enviado, incluindo apenas os campos necessários
        const { perfil, email } = formData;
        const dataToSend = {
            perfil,
            email,
        };

        if (Object.keys(validationErrors).length === 0) {
            setShowErrorMessage(false);
            try {
                const res = await servidorService.create(dataToSend, 'csrftoken');

                // Limpar o formulário após o sucesso
                setFormData({
                    perfil: '',
                    email: '',
                });
                setErrors({}); // Limpar os erros também

                if (res && res.status) {
                    console.log(res);
                    if (res.status === 200 || res.status === 201) {
                        alert('Servidor cadastrado com sucesso!');
                    } else {
                        alert('Erro ao cadastrar servidor: ' + (res.data ? res.data.message : 'Erro desconhecido'));
                    }
                } else {
                    alert('Erro na requisição: resposta indefinida.');
                }
            } catch (error) {
                console.error("Erro ao enviar os dados:", error);
                alert("Falha na comunicação com o servidor.");
            }
        } else {
            setErrors(validationErrors);
            setShowErrorMessage(true);
        }

        console.log(dataToSend); // Mostra o objeto que será enviado
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
        <form className="form-servidor" onSubmit={enviarHandler}>
            <h3>Cadastro Servidor</h3>
            <hr />
            <br />
            <div>
                <label htmlFor="perfil">Perfil:</label>
                <br />
                <div className="radio-container">
                    <label>
                        <input type="radio" value="Professor" checked={formData.perfil === 'Professor'}
                            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                        />
                        <span>Professor</span>
                    </label>
                    <label>
                        <input type="radio" value="RegistroEscolar" checked={formData.perfil === 'RegistroEscolar'}
                            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                        />
                        <span>Registros Escolares</span>
                    </label>
                    <label>
                        <input type="radio" value="GestaoEscolar" checked={formData.perfil === 'GestaoEscolar'}
                            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                        />
                        <span>Gestão Escolar</span>
                    </label>
                    <label>
                        <input type="radio" value="Coordenador" checked={formData.perfil === 'Coordenador'}
                            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                        />
                        <span>Coordenador</span>
                    </label>
                </div>
            </div>
            {/* {formData.perfil !== 'RegistroEscolar' && formData.perfil !== 'Coordenador' && formData.perfil !== "GestaoEscolar" ? (
                <>
                    <div className="form-item">
                        <label>CPF</label>
                        <InputMask
                            mask="999.999.999-99" // Formato do CPF
                            value={formData.cpf}
                            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                            required
                            onBlur={() => validarHandler('cpf')}
                            placeholder="CPF"
                            style={{ borderColor: errors.cpf ? 'red' : '' }}
                        />
                        {errors.cpf && <p className="erros">{errors.cpf}</p>}
                    </div>
                    <div className="form-item">
                        <label>Matrícula</label>
                        <input type="text" value={formData.matricula}
                            onChange={(e) => setFormData({ ...formData, matricula: e.target.value })} required
                            onBlur={() => validarHandler('matricula')}
                            placeholder="Matrícula"
                            style={{ borderColor: errors.nome ? 'red' : '' }}
                        />
                        {errors.matricula && <p className="erros">{errors.matricula}</p>}
                    </div>
                </>
            ) : (
                <></>
            )} */}

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
            <div className='botaoContainer'>
                <Button
                    width="30%"
                    color="#28A745"
                    text="Cadastrar"
                    onClick={enviarHandler}
                />
            </div>
        </form>
    );
};

export default CadastroServidor;
