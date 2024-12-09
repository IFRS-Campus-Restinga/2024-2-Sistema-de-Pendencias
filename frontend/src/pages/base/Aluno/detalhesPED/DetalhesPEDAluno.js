import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import StatusBalls from "../../../../components/StatusBall/StatusBall";
import "./DetalhesPEDAluno.css";
import { PEDService } from "../../../../services/pedService";
import { jwtDecode } from "jwt-decode";

const DetalhesPEDAluno = () => {
  const [detalhesPED, setDetalhesPED] = useState({});
  const { pedId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tipoPed = location.pathname.split('/')[4];
  const usuarioId = jwtDecode(sessionStorage.getItem("token")).idUsuario;

  const fetchDetalhes = async () => {
    try {
      const res = await PEDService.porId(pedId, tipoPed, 'detalhes');

      if (res.status !== 200) throw new Error(res.response?.data?.mensagem || "Erro desconhecido");
      setDetalhesPED(res.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes da PED:", error.message);
    }
  };

  useEffect(() => {
    fetchDetalhes();
  }, [pedId]);

  const handleVoltar = () => {
    navigate(`/sessao/Aluno/${usuarioId}`);
  };

  if (!detalhesPED || Object.keys(detalhesPED).length === 0) {
    return <div>Carregando detalhes...</div>;
  }

  return (
    <FormContainer titulo={`Detalhes da PED - ${tipoPed === "Integrado" ? "Integrado" : "ProEJA"}`} comprimento="90%">
      <label className="labelCabecalhoDetalhesPED">
        <span className="labelStatusPED">Andamento da PED</span>
      </label>

      <section className="sectionDetalhesPED">
        <div className="informacoesContainer">
          <label className="labelDetalhesPED">
            Aluno
            <p className="pDetalhesPED">{detalhesPED.aluno.nome || "Não informado"}</p>
          </label>
          <label className="labelDetalhesPED">
            Curso
            <p className="pDetalhesPED">{detalhesPED.curso.nome || "Não informado"}</p>
          </label>
          <label className="labelDetalhesPED">
            Data de Início
            <p className="pDetalhesPED">{detalhesPED.data_inicio || "Não informado"}</p>
          </label>
          <label className="labelDetalhesPED">
            Data de Fim
            <p className="pDetalhesPED">{detalhesPED.data_fim || "Não informado"}</p>
          </label>
          <label className="labelDetalhesPED">
            Docente Responsável
            <p className="pDetalhesPED">{detalhesPED.professor_ped.nome || "Não informado"}</p>
          </label>
        </div>

        <div className="divStatusContainer">
          <StatusBalls status={detalhesPED.status} tipo={"PED"} />
          <div className="buttonsContainer">
            <button className="btnVoltar" onClick={handleVoltar}>
              Voltar
            </button>
            <button
              className="btnPlanoEstudos"
              disabled={!detalhesPED.plano_estudos} // Desativa o botão se plano_estudos for null
              onClick={() =>
                navigate(`/sessao/Aluno/${usuarioId}/${tipoPed}/${pedId}/planoEstudos`, {
                  state: { usuarioId, tipoPed, pedId },
                })
              }
            >
              Plano de Estudos
            </button>
          </div>
        </div>
      </section>
    </FormContainer>
  );
};

export default DetalhesPEDAluno;
