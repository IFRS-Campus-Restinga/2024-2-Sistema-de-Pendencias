import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import './DetalhesPlanoEstudos.css';

const DetalhesPlanoEstudos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location || {}; // Recupera o estado passado, que contém as informações do plano de estudos

  if (!state) {
    return <div style={{ margin: 'auto' }}>Nenhum plano de estudos foi selecionado.</div>;
  }

  // Função para editar plano de estudos
  const handleEditar = () => {
    navigate(`/sessao/Professor/${state.idUsuario}/peds-emi/${state.pedId}/editar`);
  };

  return (
    <FormContainer comprimento="70%" titulo="Detalhes do Plano de Estudos">
      <p className="detalhe-plano-estudos"><strong>Forma de Oferta:</strong> {state.forma_oferta}</p>
      <p className="detalhe-plano-estudos"><strong>Turno:</strong> {state.turno}</p>
      <p className="detalhe-plano-estudos"><strong>Parecer Pedagógico:</strong> {state.parecer_pedagogico}</p>
      <p className="detalhe-plano-estudos"><strong>ID do Plano:</strong> {state.pedId}</p>
      <Button tipo="submit" text="Editar Plano de Estudos" onClick={handleEditar} />
    </FormContainer>
  );
};

export default DetalhesPlanoEstudos;
