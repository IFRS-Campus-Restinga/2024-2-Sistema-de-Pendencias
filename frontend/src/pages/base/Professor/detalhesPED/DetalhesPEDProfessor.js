import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import "./DetalhesPEDProfessor.css";
import Button from "../../../../components/Button/Button";
import StatusBalls from "../../../../components/StatusBall/StatusBall";
import LoadingIFRS from '../../../../components/LoadingIFRS/LoadingIFRS'
import { PEDService } from "../../../../services/pedService";
import { jwtDecode } from 'jwt-decode';

const DetalhesPEDProfessor = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [detalhesPED, setDetalhesPED] = useState({});
  const { pedId } = useParams();
  const usuarioId = jwtDecode(sessionStorage.getItem('token')).idUsuario;
  const location = useLocation();
  const tipoPed = location.pathname.split('/')[4];

  const fetchDetalhes = async () => {
    try {
      const res = await PEDService.porId(pedId, tipoPed === 'peds-emi' ? 'Integrado' : 'ProEJA', 'detalhes');
      if (res.status !== 200) throw new Error(res.response?.data?.mensagem);
      setDetalhesPED(res.data);

      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao buscar detalhes da PED:", error.message);
    }
  };

  useEffect(() => {
    fetchDetalhes(); // Caso contrário, buscar os dados da PED pelo ID
  }, [pedId]);

  if (isLoading) return <LoadingIFRS/>

  return (
    <FormContainer
      titulo={`Detalhes da PED - ${detalhesPED.serie_progressao ? "EMI" : "ProEJA"}`}
      comprimento="90%"
    >
      {detalhesPED.serie_progressao ? (
        <>
          <label className="labelCabecalhoDetalhesPED">
            <span className="spanDetalhesPED">
              Aluno -<p className="pDetalhesPED">{detalhesPED.aluno.nome}</p>
            </span>
            <label className="labelStatusPED">Andamento da PED</label>
          </label>
          <section className="sectionDetalhesPED">
            <div className="divDetalhesPED">
              <label className="labelDetalhesPED">
                Docente responsável pela progressão
                <p className="pDetalhesPED">{detalhesPED.professor_ped.nome}</p>
              </label>
              <label className="labelDetalhesPED">
                Docente que ministrou a disciplina
                <p className="pDetalhesPED">{detalhesPED.professor_disciplina.nome}</p>
              </label>
              <label className="labelDetalhesPED">
                Curso
                <p className="pDetalhesPED">{detalhesPED.curso.nome}</p>
              </label>
              <label className="labelDetalhesPED">
                Disciplina
                <p className="pDetalhesPED">{detalhesPED.disciplina.nome}</p>
              </label>
              <label className="labelDetalhesPED">
                Trimestres a Recuperar
                <p className="pDetalhesPED">{detalhesPED.trimestre_recuperar}</p>
              </label>
              <label className="labelDetalhesPED">
                Série da Progressão
                <p className="pDetalhesPED">{detalhesPED.serie_progressao}</p>
              </label>
              <label className="labelDetalhesPED">
                Turma de Origem
                <p className="pDetalhesPED">{detalhesPED.turma_atual.numero}</p>
              </label>
            </div>
            <div className="divStatusPED">
              <StatusBalls status={detalhesPED.status} tipo={"PED"} />
              <span className="spanDetalhesPED">
                <Link to={"planoEstudos"}>
                  <Button text="Cadastrar Plano de Estudos" />
                </Link>
                <Link to={"cadastrar-form-encerramento"}>
                  <Button text="Formulário de Encerramento" />
                </Link>
                <Link to={`/sessao/Professor/${usuarioId}/atividades/emi/${pedId}`}>
                  <Button text='Atividades'/>
                </Link>
                <Link to={`/sessao/Professor/${usuarioId}/peds-emi/${pedId}/planoEstudos/${detalhesPED.id}/detalhes`}>
                  <Button text='Ver Plano de Estudos'/>
                </Link>
                <Link to={`/sessao/Professor/${usuarioId}/observacoes/emi/${pedId}`}>
                  <Button text='Lista Observações'/>
                </Link>
              </span>
            </div>
          </section>
        </>
      ) : (
        <>
          <label className="labelCabecalhoDetalhesPED">
            <span className="spanDetalhesPED">
              Aluno -<p className="pDetalhesPED">{detalhesPED.aluno.nome}</p>
            </span>
            <label className="labelStatusPED">Andamento da PED</label>
          </label>
          <section className="sectionDetalhesPED">
            <div className="divDetalhesPED">
              <label className="labelDetalhesPED">
                Docente responsável pela progressão
                <p className="pDetalhesPED">{detalhesPED.professor_ped.nome}</p>
              </label>
              <label className="labelDetalhesPED">
                Docente que ministrou a disciplina
                <p className="pDetalhesPED">{detalhesPED.professor_disciplina.nome}</p>
              </label>
              <label className="labelDetalhesPED">
                Curso
                <p className="pDetalhesPED">{detalhesPED.curso.nome}</p>
              </label>
              <label className="labelDetalhesPED">
                Disciplina
                <p className="pDetalhesPED">{detalhesPED.disciplina.nome}</p>
              </label>
              <label className="labelDetalhesPED">
                Ano/Semestre de Reprovação
                <p className="pDetalhesPED">{detalhesPED.ano_semestre_reprov}</p>
              </label>
            </div>
            <div className="divStatusPED">
              <StatusBalls status={detalhesPED.status} tipo={"PED"} />
              <span className="spanDetalhesPED">
                <Link to={"planoEstudos"}>
                  <Button text="Plano de Estudos" />
                </Link>
                <Link to={"cadastrar-form-encerramento"}>
                  <Button text="Formulário de Encerramento" />
                </Link>
                <Link to={`/sessao/Professor/${usuarioId}/atividades/proeja/${pedId}`}>
                  <Button text='Atividades'/>
                </Link>
              </span>
            </div>
          </section>
        </>
      )}

      <label className="labelDetalhesPED">
        Observação
        <p className="pDetalhesPED">{detalhesPED.observacao}</p>
      </label>
      <span className="spanDetalhesPED">
        <div className="buttons-ped">
            <>
              <Link to={"editar"} state={detalhesPED}>
                <Button text={"Editar PED"} />
              </Link>
            </>
        </div>
      </span>
    </FormContainer>
  );
};

export default DetalhesPEDProfessor;
