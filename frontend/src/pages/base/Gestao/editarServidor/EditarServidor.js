import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import './EditarServidor.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import Switch from '../../../../components/Switch/Switch';
import servidorService from '../../../../services/servidorService';

const EditarServidor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { servidor } = location.state || {};
   
    // Estado para armazenar os dados editados
    const [formData, setFormData] = useState({
        nome: servidor?.nome || '',
        email: servidor?.email || '',
        perfil: servidor?.perfil || '',
        status: servidor?.is_active ? 'Ativo' : 'Inativo',
    });

    const trocaStatus = () => {
        setFormData(prevData => ({
            ...prevData,
            status: prevData.status === 'Ativo' ? 'Inativo' : 'Ativo'
        }));
    };

    console.log(servidor)

    if (!servidor) {
        return <div>Nenhum servidor foi selecionado para editar.</div>;
    }

   
    // Função para lidar com mudanças nos campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Função para submeter o formulário de edição
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Dados enviados:", formData);

        // Converte 'Ativo'/'Inativo' de volta para true/false
        const updatedData = {
            ...formData,
            is_active: formData.status === 'Ativo',
        };
        delete updatedData.status;
        
        // requisição ao backend para atualizar os dados do servidor
        try {
            const response = await servidorService.editar(servidor.id, updatedData);
            console.log("Dados retornados da requisição:", updatedData);
            if (response && response.status === 200) {
                console.log('Servidor editado com sucesso:', response.data);
                navigate(`/sessao/GestaoEscolar/2/listaServidor/${servidor.id}/visualizarServidor`, { state: { servidor: formData } });
            } else {
                console.error('Falha ao editar o servidor');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (
            <FormContainer comprimento="50%" titulo="Editar Servidor" onSubmit={handleSubmit}>
                <div className="form-item">
                    <Switch
                        valor={formData.status}
                        valor1='Ativo'
                        valor2='Inativo'
                        stateHandler={trocaStatus} // Alterna entre Ativo e Inativo
                    />
                </div>
                <div className="detalhe-servidor">
                    <strong>Nome:</strong>
                    <Input 
                        type="text" 
                        name="nome" 
                        valor={formData.nome}
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="detalhe-servidor">
                    <strong>Email:</strong>
                    <Input 
                        type="email" 
                        name="email" 
                        valor={formData.email}
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="detalhe-servidor">
                    <strong>Perfil:</strong>
                    <Input 
                        type="text" 
                        name="perfil" 
                        valor={formData.perfil} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <Button tipo="submit" className="botao-editar" text={"Salvar Alterações"}/>
            </FormContainer>
    );
};

export default EditarServidor;