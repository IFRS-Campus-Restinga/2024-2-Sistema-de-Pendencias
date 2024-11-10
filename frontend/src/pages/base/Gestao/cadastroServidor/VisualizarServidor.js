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

    const perfilMap = {
        'GestaoEscolar': 'Gestão Escolar',
        'RegistroEscolar': 'Registros Escolares',
        'Coordenador': 'Coordenador',
        'Professor': 'Professor'
      };

    // Função para editar servidor
    const handleEditar = () => {
        navigate(`/sessao/GestaoEscolar/2/listaServidor/${servidor.id}/visualizarServidor/editarServidor`, { state: { servidor }});
    };

    return (
        <FormContainer comprimento="50%" titulo={"Detalhes do Servidor"}>
            <p className="detalhe-servidor"><strong>Status:</strong> {servidor.is_active === true ? 'Ativo' : 'Inativo'}</p>
            <p className="detalhe-servidor"><strong>Nome:</strong> {servidor.nome}</p>
            <p className="detalhe-servidor"><strong>Email:</strong> {servidor.email}</p>
            <p className="detalhe-servidor"><strong>Perfil:</strong> {perfilMap[servidor.perfil]}</p>
            <p className="detalhe-servidor"><strong>Matricula:</strong> {servidor.matricula}</p>           
            <Button color={'#FF9800'} tipo='submit' text='Editar Servidor' onClick={handleEditar}/>
        </FormContainer>
    );
};

export default VisualizarServidor;
