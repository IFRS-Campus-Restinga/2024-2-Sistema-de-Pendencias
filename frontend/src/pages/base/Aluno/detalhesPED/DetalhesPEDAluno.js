import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import "./DetalhesPEDAluno.css";
import { PEDService } from "../../../../services/pedService";
import { jwtDecode } from "jwt-decode";

const DetalhesPEDAluno = () => {
  const [detalhesPED, setDetalhesPED] = useState({});
  const { pedId, modalidade } = useParams(); // Modalidade vem da URL
  const usuarioId = jwtDecode(sessionStorage.getItem("token")).idUsuario;

  const fetchDetalhes = async () => {
    try {
      const res = await PEDService.porId(pedId, modalidade); // Modalidade passada para o serviço
      if (res.status !== 200) throw new Error(res.response?.data?.mensagem);
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
    <FormContainer
      titulo={`Detalhes da PED - ${modalidade === "Integrado" ? "EMI" : "ProEJA"}`}
      comprimento="90%"
    >
      <section className="sectionDetalhesPED">
        <div className="divDetalhesPED">
          <label className="labelDetalhesPED">
            Docente responsável
            <p className="pDetalhesPED">{detalhesPED.professor_ped}</p>
          </label>
          <label className="labelDetalhesPED">
            Disciplina
            <p className="pDetalhesPED">{detalhesPED.disciplina}</p>
          </label>
          <label className="labelDetalhesPED">
            Curso
            <p className="pDetalhesPED">{detalhesPED.curso}</p>
          </label>
          <label className="labelDetalhesPED">
            Turma Atual
            <p className="pDetalhesPED">{detalhesPED.turma_atual || "Não informado"}</p>
          </label>
          <label className="labelDetalhesPED">
            Trimestres a Recuperar
            <p className="pDetalhesPED">{detalhesPED.trimestre_recuperar}</p>
          </label>
        </div>
        <div className="divStatusPED">
          <p className="status">{detalhesPED.status}</p>
        </div>
      </section>

      <label className="labelDetalhesPED">
        Observação
        <p className="pDetalhesPED">{detalhesPED.observacao}</p>
      </label>
    </FormContainer>
  );
};

export default DetalhesPEDAluno;
