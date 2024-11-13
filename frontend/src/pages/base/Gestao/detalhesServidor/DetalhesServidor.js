import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import "./DetalhesServidor.css";
import FormContainer from '../../../../components/FormContainer/FormContainer';


const DetalhesServidor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { servidor } = location.state || {};  // Recupera o estado passado

    if (!servidor) {
        return <div>Nenhum servidor foi selecionado.</div>;
    }

    const grupoMap = {
        'GestaoEscolar': 'Gestão Escolar',
        'RegistroEscolar': 'Registros Escolares',
        'Coordenador': 'Coordenador',
        'Professor': 'Professor'
      };

    // Função para editar servidor
    const handleEditar = () => {
        navigate(`/sessao/GestaoEscolar/2/editarServidor/${servidor.id}`, { state: { servidor } });
    };

    return (
        <FormContainer comprimento="50%" titulo={"Detalhes do Servidor"}>
            <p className="detalhe-servidor"><strong>Status:</strong> {servidor.is_active === true ? 'Ativo' : 'Inativo'}</p>
            <p className="detalhe-servidor"><strong>Nome:</strong> {servidor.nome}</p>
            <p className="detalhe-servidor"><strong>Email:</strong> {servidor.email}</p>
            <p className="detalhe-servidor"><strong>Perfil:</strong> {grupoMap[servidor.grupo]}</p>
            <p className="detalhe-servidor"><strong>Matricula:</strong> {servidor.matricula}</p>           
            <Button tipo='submit' text='Editar Servidor' onClick={handleEditar}/>
        </FormContainer>
    );
};

export default DetalhesServidor;
