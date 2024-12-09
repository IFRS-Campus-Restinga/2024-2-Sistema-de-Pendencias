import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlanoEstudosService } from "../../../../services/planoEstudosService";
import { PEDService } from "../../../../services/pedService";
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Button from '../../../../components/Button/Button';
import { ToastContainer } from 'react-toastify';
import { jsPDF } from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";

const DetalhesPlanoEstudo = () => {
  const { idUsuario, pedId, modalidade } = useParams();

  const [planoEstudo, setPlanoEstudo] = useState(null);
  const [pedVinculada, setPedVinculada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { detalhesPED } = location.state || {};

  const navigate = useNavigate();

  const aluno = detalhesPED?.aluno?.nome || '';
  const curso = detalhesPED?.curso?.nome || '';
  const componenteCurricular = detalhesPED?.disciplina?.nome || '';
  const professor = detalhesPED?.professor_ped?.nome || '';
  const semestreAno = detalhesPED?.ano_semestre_reprov || '';
  const semestreSerie = detalhesPED?.serie_progressao || '';

  useEffect(() => {
    const fetchPlanoEstudo = async () => {
      try {
        const response = await PlanoEstudosService.buscarPlanoEstudo(pedId);
        setPlanoEstudo(response);
      } catch (err) {
        setError("Erro ao carregar os detalhes do plano de estudos.");
      }
    };

    const fetchPedVinculada = async () => {
      try {
        const pedData = await PEDService.porId(pedId, modalidade, false); // Busca a PED vinculada
        setPedVinculada(pedData.data);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar os dados da PED.");
        setLoading(false);
      }
    };

    fetchPlanoEstudo();
    fetchPedVinculada();
  }, [pedId, modalidade]);

  if (loading) return <div>Carregando...</div>;

  if (error) return <div>{error}</div>;

  const handleEditar = () => {
    navigate(`/sessao/Professor/${idUsuario}/planoEstudos/${pedId}/editar`, {
      state: { isEditing: true },
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Formulário do Plano de Estudos Dirigidos", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Aluno: ${aluno.nome}`, 14, 50);
    doc.text(`Curso: ${curso.nome}`, 14, 60);
    doc.text(`Forma de oferta: ${planoEstudo?.forma_oferta}`, 14, 70);
    doc.text(`Modalidade: ${modalidade}`, 14, 80);
    doc.text(`Componente Curricular: ${componenteCurricular}`, 14, 90);
    doc.text(`Professor(a): ${professor.nome}`, 14, 100);
    doc.text(`Semestre/Ano letivo: ${semestreAno}`, 14, 110);
    doc.text(`Semestre/Série do curso: ${semestreSerie}`, 14, 120);

    const turnos = ["Manhã", "Tarde", "Noite", "Integral"];
    const yTurnoBase = 130;
    doc.text("Turno:", 14, yTurnoBase);
    turnos.forEach((turnoItem, index) => {
      const xPosition = 30 + index * 40;
      doc.rect(xPosition, yTurnoBase - 4, 4, 4);
      if (planoEstudo?.turno === turnoItem) doc.text("X", xPosition + 1, yTurnoBase - 0.7);
      doc.text(turnoItem, xPosition + 8, yTurnoBase);
    });

    doc.setFont("helvetica", "bold");
    doc.text("PARECER PEDAGÓGICO", 14, 150);
    doc.setFont("helvetica", "normal");
    const parecerText = doc.splitTextToSize(planoEstudo?.parecer_pedagogico, 180);
    doc.text(parecerText, 14, 160);

    doc.setFont("helvetica", "italic");
    doc.text("Assinatura do(a) professor(a):", 14, 250);

    doc.save("Plano_de_Estudo.pdf");
  };


  return (
    <FormContainer titulo="Detalhes do Plano de Estudos">

      <p><strong>Forma de Oferta:</strong> {planoEstudo?.forma_oferta}</p>
      <p><strong>Turno:</strong> {planoEstudo?.turno}</p>
      <p><strong>Parecer Pedagógico:</strong> {planoEstudo?.parecer_pedagogico}</p>

      {pedVinculada && (
        <div>
          <h4>Plano de Estudo Vinculado:</h4>
          <p><strong>Nome do PED:</strong> {pedVinculada.nome}</p>
          <p><strong>Status:</strong> {pedVinculada.status}</p>
        </div>
      )}

      <Button text="Editar Plano" onClick={handleEditar} />
      <Button text="Exportar para PDF" onClick={handleExportPDF} />

      <ToastContainer />
    </FormContainer>
  );
};

export default DetalhesPlanoEstudo;
