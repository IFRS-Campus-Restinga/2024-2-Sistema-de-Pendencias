import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import StatusBalls from "../../../../components/StatusBall/StatusBall";
import "./DetalhesDependenciaAluno.css";
import { PEDService } from "../../../../services/pedService";
import { jwtDecode } from "jwt-decode";
import { PPTService } from "../../../../services/emiPptService";
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS";
import proeja from '../../../../assets/loading-peds-proeja.png'
import emi from '../../../../assets/loading-peds.png'
import ppt from '../../../../assets/loading-ppt.png'
import { alunoService } from "../../../../services/alunoService";

const DetalhesDependenciaAluno = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [detalhesDependencia, setDetalhesDependencia] = useState({});
  const { pedId, modalidade } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const usuarioId = jwtDecode(sessionStorage.getItem("token")).idUsuario;

  const fetchDetalhesPED = async () => {
    try {
      const res = await PEDService.porId(pedId, modalidade, 'detalhes');

      if (res.status !== 200) throw new Error(res.response?.data?.mensagem || "Erro desconhecido");
      setDetalhesDependencia(res.data);

      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao buscar detalhes da PED:", error.message);
    }
  };

  const fetchDetalhesPPT = async () => {
    try {
      const res = await alunoService.detalhesPPTAluno(pedId, 'aluno')

      if (res.status !== 200) throw new Error(res.response?.data?.mensagem || "Erro desconhecido");

      setDetalhesDependencia(res.data)

      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (modalidade === 'Integrado' || modalidade === 'ProEJA') {
      fetchDetalhesPED();
    } else {
      fetchDetalhesPPT()
    }
  }, [pedId, modalidade]);

  const setIcone = (tipo) => {
    switch (tipo) {
      case 'ProEJA':
        return proeja
      case 'Integrado':
        return emi
      case 'PPT':
        return ppt
      default:
        break;
    }
  }

  const handleVoltar = () => {
    navigate(`/sessao/Aluno/${usuarioId}`);
  };

  if (isLoading) return <LoadingIFRS icone={setIcone(modalidade)}/>

  return (
    <FormContainer titulo={`Detalhes da Dependência - ${modalidade}`} comprimento="90%">
      <label className="labelCabecalhoDetalhesDependencia">
        <span className="labelStatusPED">Andamento da PED</span>
      </label>

      <section className="sectionDetalhesDependencia">
        <div className="informacoesContainer">
          <label className="labelDetalhesDependencia">
            Aluno
            <p className="pDetalhesDependencia">{detalhesDependencia.aluno.nome || "Não informado"}</p>
          </label>
          <label className="labelDetalhesDependencia">
            Curso
            <p className="pDetalhesDependencia">{detalhesDependencia.curso.nome || "Não informado"}</p>
          </label>
          <label className="labelDetalhesDependencia">
            Data de Início
            <p className="pDetalhesDependencia">{detalhesDependencia.data_inicio || "Não informado"}</p>
          </label>
          <label className="labelDetalhesDependencia">
            Data de Fim
            <p className="pDetalhesDependencia">{detalhesDependencia.data_final || "Não informado"}</p>
          </label>
          <label className="labelDetalhesDependencia">
            Docente Responsável
            <p className="pDetalhesDependencia">{detalhesDependencia?.professor_ped?.nome || detalhesDependencia.professor_ppt.nome}</p>
          </label>
        </div>

        <div className="divStatusContainer">
          <StatusBalls status={detalhesDependencia.status} tipo={"PED"} />
          <div className="buttonsContainer">
            <button className="btnVoltar" onClick={handleVoltar}>
              Voltar
            </button>
            {
              modalidade !== 'PPT' ? (
                <button
                  className="btnPlanoEstudos"
                  disabled={!detalhesDependencia.plano_estudos} // Desativa o botão se plano_estudos for null
                  onClick={() =>
                    navigate(`/sessao/Aluno/${usuarioId}/${modalidade}/${pedId}/planoEstudos`, {
                      state: { usuarioId, modalidade, pedId, plano_id: detalhesDependencia?.plano_estudos},
                    })
                  }
                >
                  Plano de Estudos
                </button>
              ) : (
                <></>
              )
            }
          </div>
        </div>
      </section>
    </FormContainer>
  );
};

export default DetalhesDependenciaAluno;
