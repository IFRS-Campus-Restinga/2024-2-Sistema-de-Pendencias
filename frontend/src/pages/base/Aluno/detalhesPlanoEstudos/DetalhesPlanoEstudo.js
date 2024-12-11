import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { PlanoEstudosService } from "../../../../services/planoEstudosService";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DetalhesPlanoEstudo.css";

const DetalhesPlanoEstudo = () => {
  const { pedId, modalidade } = useParams();
  const location = useLocation();
  const { usuarioId, plano_id } = location.state || {};

  const [planoEstudo, setPlanoEstudo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchPlanoEstudo = async () => {
    try {
      const response = await PlanoEstudosService.buscarPlanoEstudo(plano_id, 'aluno');
      setPlanoEstudo(response.data);

    } catch (err) {
      console.error(err);
      setError("Erro ao carregar os detalhes do plano de estudos.");
      toast.error("Erro ao carregar os detalhes do plano de estudos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanoEstudo();
  }, [pedId]);

  if (loading) return <div>Carregando...</div>;

  const handleVoltar = () => {
    navigate(`/sessao/Aluno/${usuarioId}/${modalidade}/${pedId}/detalhes`);
  };

  return (
    <FormContainer titulo="Detalhes do Plano de Estudos">
      <div className="detalhes-plano-estudos">
        <p><strong>Forma de Oferta:</strong> {planoEstudo.forma_oferta || "Não informado"}</p>
        <p><strong>Turno:</strong> {planoEstudo.turno || "Não informado"}</p>
      </div>

      <div className="buttonContainer">
        <Button text="Voltar" onClick={handleVoltar} />
      </div>

      <ToastContainer />
    </FormContainer>
  );
};

export default DetalhesPlanoEstudo;
