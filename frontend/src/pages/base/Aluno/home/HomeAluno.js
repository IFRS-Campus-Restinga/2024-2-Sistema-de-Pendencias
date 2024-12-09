import React, { useEffect, useState } from "react";
import { alunoService } from "../../../../services/alunoService";
import "./HomeAluno.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const HomeAluno = () => {
  const [dependencias, setDependencias] = useState([]);
  const [dependenciasVisiveis, setDependenciasVisiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear() + 3;
  const [visibleYears, setVisibleYears] = useState([currentYear, currentYear - 1, currentYear - 2, currentYear - 3]);
  const [minYear, setMinYear] = useState();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState(["Criada", "Em Andamento", "Finalizada", "Desativado"]);

  const statusOptions = ["Criada", "Em Andamento", "Finalizada", "Desativado"];

  const carregarPeds = async () => {
    try {
      const response = await alunoService.listarDependenciasAluno();

      const years = response.data.map((dependencia) => {
        if (dependencia.periodo_letivo) return new Date(dependencia.periodo_letivo).getFullYear();
        if (dependencia.data_inicio) return new Date(dependencia.data_inicio).getFullYear();
      });

      const minYearFromPeds = Math.min(...years);
      setMinYear(Math.min(minYearFromPeds, currentYear - 3));
      setDependencias(response.data);
      organizarDependenciasPorAno(response.data);
    } catch (erro) {
      console.error("Erro ao carregar PEDS do aluno:", erro);
      toast.error("Erro ao carregar PEDS. Tente novamente.", {
        position: "bottom-center",
        autoClose: 3000,
        style: { backgroundColor: "#d11c28", color: "#fff" },
        progressStyle: { backgroundColor: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  const organizarDependenciasPorAno = (dependencias) => {
    const dependenciasPorAno = {};

    visibleYears.forEach((ano) => {
      dependenciasPorAno[ano] = dependencias.filter(
        (dependencia) =>
          new Date(dependencia.periodo_letivo || dependencia.data_inicio).getFullYear() === ano &&
          selectedStatus.includes(dependencia.status)
      );
    });

    setDependenciasVisiveis(visibleYears.map((ano) => ({ ano, dependencias: dependenciasPorAno[ano] || [] })));
  };

  const handleScrollYears = (direction) => {
    if (direction === "right" && visibleYears[3] > minYear) {
      setVisibleYears(visibleYears.map((ano) => ano - 1));
    } else if (direction === "left" && visibleYears[0] < currentYear) {
      setVisibleYears(visibleYears.map((ano) => ano + 1));
    }
    organizarDependenciasPorAno(dependencias);
  };

  const toggleStatusFilter = (status) => {
    setSelectedStatus((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  };

  const handleNavigateToDetalhes = (dependencia) => {
    const modalidade = dependencia.turma_atual ? "Integrado" : "ProEJA";
    navigate(`${modalidade}/${dependencia.id}/detalhes`);
  };

  useEffect(() => {
    carregarPeds();
  }, []);

  useEffect(() => {
    organizarDependenciasPorAno(dependencias);
  }, [visibleYears, dependencias, selectedStatus]);

  return (
    <div className="homeAlunoContainer">
      <h2>Minhas - PED'S</h2>

      <div className="filterArrowContainer">
        {/* Filtro de Status */}
        <div className="filterContainer">
          <h4>Status:</h4>
          <div className="filterOptions">
            {statusOptions.map((status) => (
              <label key={status} className="filterOption">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes(status)}
                  onChange={() => toggleStatusFilter(status)}
                />
                <span className="filterLabel">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Setas para navegar entre anos */}
        <div className="arrowContainer">
          <button className="arrowButton" onClick={() => handleScrollYears("left")} disabled={visibleYears[0] >= currentYear}>
            ←
          </button>
          <button className="arrowButton" onClick={() => handleScrollYears("right")} disabled={visibleYears[3] <= minYear}>
            →
          </button>
        </div>
      </div>

      <div className="pedsContainer">
        {dependenciasVisiveis.map(({ ano, dependencias }) => (
          <div key={ano} className="pedsAno">
            <h3>{ano}</h3>
            <div className="pedsCards">
              {dependencias.length > 0 ? (
                dependencias.map((dependencia) => (
                  <div
                    key={dependencia.id}
                    className={`pedCard ${dependencia.status.toLowerCase().replace(" ", "-")}`}
                    onClick={() => handleNavigateToDetalhes(dependencia)}
                  >
                    <h4>{dependencia.data_inicio ? `PPT ${dependencia.id}` : `PED ${dependencia.id}`}</h4>
                    <p><strong>Curso:</strong> {dependencia.curso.nome}</p>
                    {dependencia.turma_atual && <p><strong>Turma atual:</strong> {dependencia.turma_atual.numero}</p>}
                    <p><strong>Disciplina:</strong> {dependencia.disciplina.nome}</p>
                    <p><strong>Docente Responsável:</strong> {dependencia?.professor_ped?.nome || dependencia?.professor_ppt?.nome}</p>
                    <span className="status">{dependencia.status}</span>
                  </div>
                ))
              ) : (
                <div className="emptyCard">Sem PEDs cadastradas</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeAluno;
