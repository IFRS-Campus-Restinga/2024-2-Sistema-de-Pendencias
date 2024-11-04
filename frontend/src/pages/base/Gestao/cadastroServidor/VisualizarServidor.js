import React from 'react';
import { useLocation } from 'react-router-dom';

const VisualizarServidor = () => {
    const location = useLocation();
    const { servidor } = location.state || {};  // Recupera o estado passado
  
    if (!servidor) {
      return <div>Nenhum servidor foi selecionado.</div>;
    }

    return (
        <div>
            <h1>Detalhes do Servidor</h1>
            <p><strong>Nome:</strong> {servidor.nome}</p>
            <p><strong>Email:</strong> {servidor.email}</p>
            <p><strong>Perfil:</strong> {servidor.perfil}</p>
        </div>
    );
};

export default VisualizarServidor;
