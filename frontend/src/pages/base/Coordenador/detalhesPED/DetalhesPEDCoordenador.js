import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import "./DetalhesPEDCoordenador.css";
import Button from "../../../../components/Button/Button";
import StatusBalls from "../../../../components/StatusBall/StatusBall";
import { PEDService } from "../../../../services/pedService";
import { jwtDecode } from 'jwt-decode';

const DetalhesPEDCoordenador = () => {
  const [detalhesPED, setDetalhesPED] = useState({});
  const { pedId } = useParams();
  const usuarioId = jwtDecode(sessionStorage.getItem('token')).idUsuario;
  const location = useLocation();
  const { state } = location || {};

  const fetchDetalhes = async () => {
    try {
      const res = await PEDService.porId(pedId, "EMI");
      if (res.status !== 200) throw new Error(res.response?.data?.mensagem);
      setDetalhesPED(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes da PED:", error.message);
    }
  };

  useEffect(() => {
    if (state) {
      setDetalhesPED(state); // Usar o 'state' se estiver disponível
    } else {
      fetchDetalhes(); // Caso contrário, buscar os dados da PED pelo ID
    }
  }, [pedId, state]);


  // Garantir que o 'state' tenha valores válidos antes de acessar
  if (!state) {
    return <div>Carregando detalhes...</div>; // Mostrar um carregamento enquanto os dados não estão disponíveis
  }

  return (
    <FormContainer
      titulo={`Detalhes da PED - ${state.serie_progressao ? "EMI" : "ProEJA"}`}
      comprimento="90%"
    >
      {state.serie_progressao ? (
        <>
          <label className="labelCabecalhoDetalhesPED">
            <span className="spanDetalhesPED">
              Aluno -<p className="pDetalhesPED">{state.aluno}</p>
            </span>
            <label className="labelStatusPED">Andamento da PED</label>
          </label>
          <section className="sectionDetalhesPED">
            <div className="divDetalhesPED">
              <label className="labelDetalhesPED">
                Docente responsável pela progressão
                <p className="pDetalhesPED">{state.professor_ped}</p>
              </label>
              <label className="labelDetalhesPED">
                Docente que ministrou a disciplina
                <p className="pDetalhesPED">{state.professor_disciplina}</p>
              </label>
              <label className="labelDetalhesPED">
                Curso
                <p className="pDetalhesPED">{state.curso}</p>
              </label>
              <label className="labelDetalhesPED">
                Disciplina
                <p className="pDetalhesPED">{state.disciplina}</p>
              </label>
              <label className="labelDetalhesPED">
                Trimestres a Recuperar
                <p className="pDetalhesPED">{state.trimestre_recuperar}</p>
              </label>
              <label className="labelDetalhesPED">
                Série da Progressão
                <p className="pDetalhesPED">{state.serie_progressao}</p>
              </label>
              <label className="labelDetalhesPED">
                Turma de Origem
                <p className="pDetalhesPED">{state.turma_origem}</p>
              </label>
            </div>
            <div className="divStatusPED">
              <StatusBalls status={state.status} tipo={"PED"} />
            </div>
          </section>
        </>
      ) : (
        <>
          <label className="labelCabecalhoDetalhesPED">
            <span className="spanDetalhesPED">
              Aluno -<p className="pDetalhesPED">{state.aluno}</p>
            </span>
            <label className="labelStatusPED">Andamento da PED</label>
          </label>
          <section className="sectionDetalhesPED">
            <div className="divDetalhesPED">
              <label className="labelDetalhesPED">
                Docente responsável pela progressão
                <p className="pDetalhesPED">{state.professor_ped}</p>
              </label>
              <label className="labelDetalhesPED">
                Docente que ministrou a disciplina
                <p className="pDetalhesPED">{state.professor_disciplina}</p>
              </label>
              <label className="labelDetalhesPED">
                Curso
                <p className="pDetalhesPED">{state.curso}</p>
              </label>
              <label className="labelDetalhesPED">
                Disciplina
                <p className="pDetalhesPED">{state.disciplina}</p>
              </label>
              <label className="labelDetalhesPED">
                Ano/Semestre de Reprovação
                <p className="pDetalhesPED">{state.ano_semestre_reprov}</p>
              </label>
            </div>
            <div className="divStatusPED">
              <StatusBalls status={state.status} tipo={"PED"} />
              
            </div>
          </section>
        </>
      )}

      <label className="labelDetalhesPED">
        Observação
        <p className="pDetalhesPED">{state.observacao}</p>
      </label>
     
    </FormContainer>
  );
};

export default DetalhesPEDCoordenador;