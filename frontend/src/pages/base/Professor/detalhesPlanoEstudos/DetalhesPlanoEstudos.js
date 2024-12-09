import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PlanoEstudosService } from "../../../../services/planoEstudosService";
import { PEDService } from "../../../../services/pedService";
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Button from '../../../../components/Button/Button';
import { ToastContainer } from 'react-toastify';
import { jsPDF } from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';
import LogoIFRS from '../../../../assets/logo-ifrs-colorido.png';

const DetalhesPlanoEstudo = () => {
  const { idUsuario, pedId, modalidade } = useParams();

  const [planoEstudo, setPlanoEstudo] = useState(null);
  const [detalhesPED, setDetalhesPED] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const tipoPed = location.pathname.split('/')[4];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const planoResponse = await PlanoEstudosService.buscarPlanoEstudo(pedId);
        console.log("Plano de Estudo:", planoResponse);

        const pedResponse = await PEDService.porId(pedId, tipoPed === 'peds-emi' ? 'Integrado' : 'ProEJA', 'detalhes');
        console.log("Detalhes PED:", pedResponse.data);

        setPlanoEstudo(planoResponse);
        setDetalhesPED(pedResponse.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar os dados do plano de estudos ou da PED.");
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
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

    doc.addImage(LogoIFRS, 70, 10, 60, 16, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Formulário do Plano de Estudos Dirigidos", 105, 50, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Aluno: ${detalhesPED?.aluno?.nome}`, 14, 70);
    doc.text(`Curso: ${detalhesPED?.curso?.nome}`, 14, 80);
    doc.text(`Forma de oferta: ${planoEstudo?.forma_oferta}`, 14, 90);
    doc.text(`Componente Curricular: ${detalhesPED?.disciplina?.nome}`, 14, 100);
    doc.text(`Professor(a): ${detalhesPED?.professor_ped?.nome}`, 14, 110);
    doc.text(`Semestre/Ano letivo: ${detalhesPED?.trimestre_recuperar}`, 14, 120);
    doc.text(`Semestre/Série do curso: ${detalhesPED?.serie_progressao}`, 14, 130);

    const turnos = ["Manhã", "Tarde", "Noite", "Integral"];
    const yTurnoBase = 140;
    doc.text("Turno:", 14, yTurnoBase);
    turnos.forEach((turnoItem, index) => {
      const xPosition = 30 + index * 40;
      doc.rect(xPosition, yTurnoBase - 4, 4, 4);
      if (planoEstudo?.turno === turnoItem) doc.text("X", xPosition + 1, yTurnoBase - 0.7);
      doc.text(turnoItem, xPosition + 8, yTurnoBase);
    });

    doc.setFont("helvetica", "bold");
    doc.text("PARECER PEDAGÓGICO", 105, 180, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("OBS: Descrever o desenvolvimento do estudante durante a realização do componente curricular", 14, 190);
    doc.text("e apontar os objetivos/aspectos que ainda não foram atingidos pelo mesmo, indicando os", 14, 200);
    doc.text("conteúdos/ conhecimentos que precisam ser recuperados.", 14, 210);
    doc.setFont("helvetica", "normal");
    doc.text("Parecer do(a) professor(a):", 14, 230);
    const parecerText = doc.splitTextToSize(planoEstudo?.parecer_pedagogico, 180);
    doc.text(parecerText, 14, 240);

    doc.setFont("helvetica", "italic");
    doc.text("Assinatura do(a) professor(a):", 14, 280);

    doc.save("Plano_de_Estudo.pdf");
  };

  return (
    <FormContainer titulo="Detalhes do Plano de Estudos">
      <br />
      <p><strong>Forma de Oferta:</strong> {planoEstudo?.forma_oferta}</p>
      <p><strong>Turno:</strong> {planoEstudo?.turno}</p>
      <p><strong>Parecer Pedagógico:</strong> {planoEstudo?.parecer_pedagogico}</p>
      <br />
      <br />

      <Button text="Editar Plano" onClick={handleEditar} />
      <Button text="Exportar para PDF" onClick={handleExportPDF} />

      <ToastContainer />
    </FormContainer>
  );
};

export default DetalhesPlanoEstudo;
