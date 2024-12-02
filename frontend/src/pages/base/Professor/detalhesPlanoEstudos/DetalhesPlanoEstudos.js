import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlanoEstudosService } from "../../../../services/planoEstudosService"; 
import { PEDService } from "../../../../services/pedService"; 
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Button from '../../../../components/Button/Button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetalhesPlanoEstudo = () => {
  const { idUsuario, pedId, modalidade } = useParams(); 
  
  const [planoEstudo, setPlanoEstudo] = useState(null);  
  const [pedVinculada, setPedVinculada] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchPlanoEstudo = async () => {
      try {
        const response = await PlanoEstudosService.buscarPlanoEstudo(pedId);
        setPlanoEstudo(response); 
      } catch (err) {
        setError("Erro ao carregar os detalhes do plano de estudos.");
      }
    };

    const fetchPedVinculada = async () => {
      try {
        const pedData = await PEDService.porId(pedId, modalidade, false); // Busca a PED vinculada
        setPedVinculada(pedData.data); 
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar os dados da PED.");
        setLoading(false);
      }
    };

    fetchPlanoEstudo(); 
    fetchPedVinculada(); 
  }, [pedId, modalidade]);

  if (loading) return <div>Carregando...</div>;

  if (error) return <div>{error}</div>;

  const handleEditar = () => {
    navigate(`/sessao/Professor/${idUsuario}/planoEstudos/${pedId}/editar`, {
      state: { isEditing: true }, 
    });
  };

  return (
    <FormContainer titulo="Detalhes do Plano de Estudos">
      {/* Exibição dos dados do plano de estudos */}
      <p><strong>Forma de Oferta:</strong> {planoEstudo?.forma_oferta}</p>
      <p><strong>Turno:</strong> {planoEstudo?.turno}</p>
      <p><strong>Parecer Pedagógico:</strong> {planoEstudo?.parecer_pedagogico}</p>

      {/* Exibição dos dados do PED vinculado (se necessário) */}
      {pedVinculada && (
        <div>
          <h4>Plano de Estudo Vinculado:</h4>
          <p><strong>Nome do PED:</strong> {pedVinculada.nome}</p>
          <p><strong>Status:</strong> {pedVinculada.status}</p>
          {/* Outros detalhes do PED, se necessário */}
        </div>
      )}

      {/* Botão para editar o plano de estudos */}
      <Button text="Editar Plano" onClick={handleEditar} />
      
      <ToastContainer /> {/* Exibe as mensagens de toast, se houver */}
    </FormContainer>
  );
};

export default DetalhesPlanoEstudo;

