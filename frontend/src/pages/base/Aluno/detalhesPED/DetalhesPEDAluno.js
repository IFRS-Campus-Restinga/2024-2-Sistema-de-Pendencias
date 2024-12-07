import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import "./DetalhesPEDAluno.css";
import { PEDService } from "../../../../services/pedService";
import { jwtDecode } from "jwt-decode";

const DetalhesPEDAluno = () => {
  const [detalhesPED, setDetalhesPED] = useState({});
  const { pedId, modalidade: modalidadeParam } = useParams();
  const location = useLocation();
  const modalidade = location.state?.modalidade || modalidadeParam; // Captura do state ou da URL
  const usuarioId = jwtDecode(sessionStorage.getItem("token")).idUsuario;

  const fetchDetalhes = async () => {
    try {
      console.log("pedId:", pedId);
      console.log("modalidade:", modalidade);

      const res = await PEDService.detalhesPorIdAluno(pedId, modalidade);

      if (res.status !== 200) throw new Error(res.response?.data?.mensagem || "Erro desconhecido");
      setDetalhesPED(res.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes da PED:", error.message);
    }
  };

  useEffect(() => {
    fetchDetalhes();
  }, [pedId, modalidade]);

  if (!detalhesPED) {
    return <div>Carregando detalhes...</div>;
  }

  return (
    <FormContainer titulo={`Detalhes da PED - ${modalidade}`} comprimento="90%">
      <section className="sectionDetalhesPED">
        <div className="divDetalhesPED">
          <label className="labelDetalhesPED">
            Docente responsável
            <p className="pDetalhesPED">{detalhesPED.professor_ped || "Não informado"}</p>
          </label>
          <label className="labelDetalhesPED">
            Disciplina
            <p className="pDetalhesPED">{detalhesPED.disciplina || "Não informado"}</p>
          </label>
        </div>
        <div className="divStatusPED">
          <p className="status">{detalhesPED.status}</p>
        </div>
      </section>
    </FormContainer>
  );
};

export default DetalhesPEDAluno;
