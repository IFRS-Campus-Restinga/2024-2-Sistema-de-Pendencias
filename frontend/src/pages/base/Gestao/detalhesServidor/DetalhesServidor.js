import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import "./DetalhesServidor.css";
import FormContainer from '../../../../components/FormContainer/FormContainer';


const DetalhesServidor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location || {};  // Recupera o estado passado

    if (!state) {
        return <div style={{margin: 'auto'}}>Nenhum servidor foi selecionado.</div>;
    }

    // Função para editar servidor
    const handleEditar = () => {
        navigate(`editar`, { state: { state } });
    };

    return (
        <FormContainer comprimento="70%" titulo={"Detalhes do Servidor"}>
            <p className="detalhe-servidor"><strong>Status:</strong> {state.ativo}</p>
            <p className="detalhe-servidor"><strong>Nome:</strong> {state.nome}</p>
            <p className="detalhe-servidor"><strong>Email:</strong> {state.email}</p>
            <p className="detalhe-servidor"><strong>Perfil:</strong> {state.grupo}</p>
            <p className="detalhe-servidor"><strong>Matricula:</strong> {state?.matricula}</p>           
            <Button tipo='submit' text='Editar Servidor' onClick={handleEditar}/>
        </FormContainer>
    );
};

export default DetalhesServidor;
