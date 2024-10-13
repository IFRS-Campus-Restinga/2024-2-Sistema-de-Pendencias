import React, { useState } from 'react';
import servidorService from '../../services/servidorService';
import Header from "../../components/Header/Header";
import PageContainer from "../../components/PageContainer/PageContainer";
import "./CadastroServidor.css";
import BackButton from '../../components/BackButton/BackButton';
import Button from '../../components/Button/Button';

const CadastroServidor = () => {
    const [formData, setFormData] = useState({
        perfil: '',
        nome: '',
        cpf: '',
        matricula: '',
        email: ''
    });

    const envioHandler = async (e) => {
        e.preventDefault();
    
        // Crie um objeto a ser enviado, incluindo apenas os campos necessários
        const { perfil, nome, email, cpf, matricula } = formData;
        const dataToSend = {
            perfil,
            nome,
            email,
        };
    
        // Adicione cpf e matricula apenas se o perfil não for 'registroEscolar' ou 'gestaoEscolar'
        if (perfil !== 'registroEscolar' && perfil !== 'gestaoEscolar') {
            dataToSend.cpf = cpf;
            dataToSend.matricula = matricula;
        }
    
        try {
            const res = await servidorService.create(dataToSend, 'csrftoken');
    
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
            if (error.response) {
                alert(`Erro no servidor: ${error.response.data.error || 'Erro desconhecido'}`);
            } else if (error.request) {
                alert("Nenhuma resposta do servidor.");
            } else {
                alert(`Erro na requisição: ${error.message}`);
            }
            console.error("Erro ao enviar os dados:", error);
            alert("Falha na comunicação com o servidor.");
        }
        
        console.log(dataToSend); // Mostra o objeto que será enviado
    };
    
    
    const handleBack = () => {
        alert("Voltando...");
    };

    return (
        <form className="form-servidor" onSubmit={envioHandler}>
            <h3>Cadastro de Servidor</h3>
            <div>
                <label className="form-item">Perfil:</label>
                <br/>
                <div className="radio-container">
                    <label>
                        <input type="radio" value="professor" checked={formData.perfil === 'professor'}
                            onChange={(e) => setFormData({...formData, perfil: e.target.value})}
                        />
                        <span>Professor</span>
                    </label>
                    <label>
                        <input type="radio" value="registroEscolar" checked={formData.perfil === 'registroEscolar'}
                            onChange={(e) => setFormData({...formData, perfil: e.target.value})}
                        />
                        <span>Registros Escolares</span>
                    </label>
                    <label>
                        <input type="radio" value="gestaoEscolar" checked={formData.perfil === 'gestaoEscolar'}
                            onChange={(e) => setFormData({...formData, perfil: e.target.value})}
                        />
                        <span>Gestão Escolar</span>
                    </label>
                    <label>
                        <input type="radio" value="coordenador" checked={formData.perfil === 'coordenador'}
                            onChange={(e) => setFormData({...formData, perfil: e.target.value})}
                        />
                        <span>Coordenador</span>
                    </label>
                </div>
            </div>
            <div className="form-item">
                <label>Nome</label>
                <input type="text" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
            </div>

            {/* Renderização condicional para CPF e Matrícula */}
            {formData.perfil !== 'registroEscolar' && (
                <>
                    <div className="form-item">
                        <label>CPF</label>
                        <input type="text" value={formData.cpf} onChange={(e) => setFormData({...formData, cpf: e.target.value})} required />
                    </div>
                    <div className="form-item">
                        <label>Matrícula</label>
                        <input type="text" value={formData.matricula} onChange={(e) => setFormData({...formData, matricula: e.target.value})} required />
                    </div>
                </>
            )}

            <div className="form-item">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className='botaoContainer'>
                <Button
                    width="30%"
                    color="#28A745"
                    text="Cadastrar"
                    onClick={envioHandler}
                />
            </div>
        </form>
    );
};

export default CadastroServidor;
