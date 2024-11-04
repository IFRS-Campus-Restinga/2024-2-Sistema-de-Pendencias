import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import "./VisualizarServidor.css";

const VisualizarServidor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { servidor } = location.state || {};  // Recupera o estado passado

    if (!servidor) {
        return <div>Nenhum servidor foi selecionado.</div>;
    }

    return (
        <div className="visualizar-servidor-container">
            <h1>Detalhes do Servidor</h1>
            <p className="detalhe-servidor"><strong>Nome:</strong> {servidor.nome}</p>
            <p className="detalhe-servidor"><strong>Email:</strong> {servidor.email}</p>
            <p className="detalhe-servidor"><strong>Perfil:</strong> {servidor.perfil}</p>
        </div>
    );
};

export default VisualizarServidor;
