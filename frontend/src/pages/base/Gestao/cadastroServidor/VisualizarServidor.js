import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import "./VisualizarServidor.css";
import FormContainer from '../../../../components/FormContainer/FormContainer';


const VisualizarServidor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { servidor } = location.state || {};  // Recupera o estado passado

    if (!servidor) {
        return <div>Nenhum servidor foi selecionado.</div>;
    }

    // Função para editar servidor
    const handleEditar = () => {
        navigate(`/sessao/GestaoEscolar/2/listaServidor/${servidor.id}/visualizarServidor/editarServidor`, { state: { servidor }});
    };

    return (
        <FormContainer titulo={"Detalhes do Servidor"}>
            <p className="detalhe-servidor"><strong>Status:</strong> {servidor.status}</p>
            <p className="detalhe-servidor"><strong>Nome:</strong> {servidor.nome}</p>
            <p className="detalhe-servidor"><strong>Email:</strong> {servidor.email}</p>
            <p className="detalhe-servidor"><strong>Perfil:</strong> {servidor.perfil}</p>
            <p className="detalhe-servidor"><strong>Matricula:</strong> {servidor.matricula}</p>           
            <Button tipo='submit' text='Editar Servidor' onClick={handleEditar}/>
        </FormContainer>
    );
};

export default VisualizarServidor;
