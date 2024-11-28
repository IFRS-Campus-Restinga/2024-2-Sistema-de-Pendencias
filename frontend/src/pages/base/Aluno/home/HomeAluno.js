import React, { useEffect, useState } from 'react';
import { alunoService } from '../../../../services/alunoService';
import './HomeAluno.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomeAluno = () => {
    const [pedsEmi, setPedsEmi] = useState([]); // Estado para PED_EMI
    const [pedsProeja, setPedsProeja] = useState([]); // Estado para PED_ProEJA
    const [loading, setLoading] = useState(true);

    // Função para carregar as PEDS do aluno logado
    const carregarPeds = async () => {
        try {
            const response = await alunoService.listarPedsAluno(); // Método do alunoService
            setPedsEmi(response.data.ped_emi || []); // Salva as PED_EMI no estado
            setPedsProeja(response.data.ped_proeja || []); // Salva as PED_ProEJA no estado
        } catch (erro) {
            console.error("Erro ao carregar PEDS do aluno:", erro);
            toast.error("Erro ao carregar PEDS. Tente novamente.", {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#d11c28', color: '#fff' },
                progressStyle: { backgroundColor: '#fff' },
            });
        } finally {
            setLoading(false); // Define que terminou de carregar
        }
    };

    // Carregar as PEDS ao montar o componente
    useEffect(() => {
        carregarPeds();
    }, []);

    return (
        <div className="homeAlunoContainer">
            <h2>PEDS Vinculadas</h2>
            {loading ? (
                <p>Carregando PEDS...</p>
            ) : pedsEmi.length > 0 || pedsProeja.length > 0 ? (
                <ul className="pedsList">
                    {/* Renderiza PED_EMI */}
                    {pedsEmi.map((ped, index) => (
                        <li key={`emi-${index}`} className="pedItem">
                            <div>
                                <strong>Título:</strong> {ped.titulo || "Sem título"}
                            </div>
                            <div>
                                <strong>Disciplina:</strong> {ped.disciplina || "Não informada"}
                            </div>
                            <div>
                                <strong>Professor:</strong> {ped.professor_ped || "Não informado"}
                            </div>
                            <div>
                                <strong>Curso:</strong> {ped.curso || "Não informado"}
                            </div>
                        </li>
                    ))}
                    {/* Renderiza PED_ProEJA */}
                    {pedsProeja.map((ped, index) => (
                        <li key={`proeja-${index}`} className="pedItem">
                            <div>
                                <strong>Título:</strong> {ped.titulo || "Sem título"}
                            </div>
                            <div>
                                <strong>Disciplina:</strong> {ped.disciplina || "Não informada"}
                            </div>
                            <div>
                                <strong>Professor:</strong> {ped.professor_ped || "Não informado"}
                            </div>
                            <div>
                                <strong>Curso:</strong> {ped.curso || "Não informado"}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhuma PED encontrada.</p>
            )}
        </div>
    );
};

export default HomeAluno;
