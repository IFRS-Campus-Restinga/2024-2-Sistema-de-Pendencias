import React, { useEffect, useState } from "react";
import { alunoService } from "../../../../services/alunoService";
import "./HomeAluno.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeAluno = () => {
    const [pedsEmi, setPedsEmi] = useState([]);
    const [pedsProeja, setPedsProeja] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentYear = new Date().getFullYear();
    const [visibleYears, setVisibleYears] = useState([currentYear, currentYear - 1, currentYear - 2, currentYear - 3]);
    const [minYear, setMinYear] = useState(currentYear - 3);
    const [selectedStatus, setSelectedStatus] = useState(["Criada", "Em Andamento", "Finalizada", "Desativado"]);

    const statusOptions = ["Criada", "Em Andamento", "Finalizada", "Desativado"];

    const carregarPeds = async () => {
        try {
            const response = await alunoService.listarPedsAluno();
            const allPeds = [...(response.data.ped_emi || []), ...(response.data.ped_proeja || [])];
            const years = allPeds.map((ped) => new Date(ped.data_inicio).getFullYear());
            const minYearFromPeds = Math.min(...years);
            setMinYear(Math.min(minYearFromPeds, currentYear - 3));
            setPedsEmi(response.data.ped_emi || []);
            setPedsProeja(response.data.ped_proeja || []);
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

    const organizarPedsPorAno = (peds) => {
        const pedsPorAno = {};
        visibleYears.forEach((ano) => {
            pedsPorAno[ano] = peds.filter(
                (ped) =>
                    new Date(ped.data_inicio).getFullYear() === ano &&
                    selectedStatus.includes(ped.status)
            );
        });
        return visibleYears.map((ano) => ({ ano, peds: pedsPorAno[ano] || [] }));
    };

    const handleScrollYears = (direction) => {
        if (direction === "right" && visibleYears[3] > minYear) {
            setVisibleYears(visibleYears.map((ano) => ano - 1));
        } else if (direction === "left" && visibleYears[0] < currentYear) {
            setVisibleYears(visibleYears.map((ano) => ano + 1));
        }
    };

    const toggleStatusFilter = (status) => {
        setSelectedStatus((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    };

    useEffect(() => {
        carregarPeds();
    }, []);

    const pedsAgrupadas = organizarPedsPorAno([...pedsEmi, ...pedsProeja]);

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
                    <button
                        className="arrowButton"
                        onClick={() => handleScrollYears("left")}
                        disabled={visibleYears[0] >= currentYear}
                    >
                        ←
                    </button>
                    <button
                        className="arrowButton"
                        onClick={() => handleScrollYears("right")}
                        disabled={visibleYears[3] <= minYear}
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="pedsContainer">
                {pedsAgrupadas.map(({ ano, peds }) => (
                    <div key={ano} className="pedsAno">
                        <h3>{ano}</h3>
                        <div className="pedsCards">
                            {peds.length > 0 ? (
                                peds.map((ped) => (
                                    <div
                                        key={ped.id}
                                        className={`pedCard ${ped.status.toLowerCase().replace(" ", "-")}`}
                                    >
                                        <h4>{`PED ${ped.id}`}</h4>
                                        <p><strong>Curso:</strong> {ped.curso}</p>
                                        <p><strong>Turma:</strong> {ped.turma_atual || "Não informado"}</p>
                                        <p><strong>Disciplina:</strong> {ped.disciplina}</p>
                                        <p><strong>Trimestre a recuperar:</strong> {ped.trimestre_recuperar}</p>
                                        <p><strong>Docente Responsável:</strong> {ped.professor_ped}</p>
                                        <span className="status">{ped.status}</span>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="emptyCard">Sem PEDs cadastradas</div>
                                    <div className="emptyCard">Sem PEDs cadastradas</div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeAluno;
