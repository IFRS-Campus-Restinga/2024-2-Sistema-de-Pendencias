import React, { useState } from 'react';
import servidorService from '../../services/servidorService';
import Header from "../../components/Header/Header";
import PageContainer from "../../components/PageContainer/PageContainer";
import "./CadastroServidor.css";
import BackButton from '../../components/BackButton/BackButton';

//import axios from 'axios';


const CadastroServidor = () => {
    const [formData, setFormData] = useState({
        perfil: '',
        nome: '',
        cpf: '',
        matricula: '',
        email: ''
    });

    const envioHandler = async (e) => {  // Handler para envio do formulário de cadastro de servidor
        e.preventDefault();

        try {
            const res = await servidorService.create(formData, 'csrftoken');

            if (res && res.status) {
                if (res.status === 200) {
                    alert('Servidor cadastrado com sucesso!');
                } else {
                    alert('Erro ao cadastrar servidor: ' + (res.data ? res.data.message : 'Erro desconhecido'));
                }
            } else {
                alert('Erro na requisição: resposta indefinida.'); // res indefinido
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
        console.log(formData)
    };

    const handleBack = () => {
        // Lógica para voltar, como redirecionar ou fechar uma página
        alert("Voltando...");
    };

    return (
        <PageContainer>
            <Header
                usuario={{
                    nome: "Gestão Escolar",
                }}
            />
            <div id="back-button">
                <BackButton onClick={handleBack} />
            </div>
            <div className="content">
                <form onSubmit={envioHandler}>
                    <fieldset>
                        <h3>Cadastro de Servidor</h3>
                        <div>
                            <label className="form-item">Selecione o Perfil:</label>
                            <br />
                            <div className="radio-container">
                                <label>
                                    <input type="radio" value="Aluno" checked={formData.perfil === 'Aluno'}
                                        onChange={(e) => setFormData({ ...formData, perfil: e.target.value })} />
                                    <span>Aluno</span>
                                </label>
                                <label>
                                    <input type="radio" value="Professor" checked={formData.perfil === 'Professor'}
                                        onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                                    />
                                    <span>Professor</span>
                                </label>
                                <label>
                                    <input type="radio" value="Registros Escolares" checked={formData.perfil === 'Registros Escolares'}
                                        onChange={(e) => setFormData({ ...formData, perfil: e.target.value })} />
                                    <span>Registros Escolares</span>
                                </label>
                                <label>
                                    <input type="radio" value="Gestão Escolar" checked={formData.perfil === 'Gestão Escolar'}
                                        onChange={(e) => setFormData({ ...formData, perfil: e.target.value })} />
                                    <span>Gestão Escolar</span>
                                </label>
                                <label>
                                    <input type="radio" value="Coordenador" checked={formData.perfil === 'Coordenador'}
                                        onChange={(e) => setFormData({ ...formData, perfil: e.target.value })} />
                                    <span>Coordenador</span>
                                </label>
                            </div>
                        </div>
                        <div className="form-item">
                            <label>Nome</label>
                            <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
                        </div>
                        <div className="form-item">
                            <label>CPF</label>
                            <input type="text" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} required />
                        </div>
                        <div className="form-item">
                            <label>Matrícula</label>
                            <input type="text" value={formData.matricula} onChange={(e) => setFormData({ ...formData, matricula: e.target.value })} required />
                        </div>
                        <div className="form-item">
                            <label>Email</label>
                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        </div>
                    </fieldset>
                    <button className="custom-button" type="submit">Cadastrar</button>
                </form>
            </div>
        </PageContainer>
    );
};

export default CadastroServidor;
