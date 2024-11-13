import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calendarioAcademicoService } from '../../../../../services/calendarioAcademicoService';
import './listaCalendariosAcademicos.css';

const ListarCalendariosAcademicosPage = () => {
  const navigate = useNavigate();
  const [calendarios, setCalendarios] = useState([]);

  useEffect(() => {
    const fetchCalendarios = async () => {
      try {
        const response = await calendarioAcademicoService.listarCalendariosAcademicos();
        setCalendarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar calendários acadêmicos:", error);
      }
    };
    fetchCalendarios();
  }, []);

  const handleCalendarioClick = (id) => {
    navigate(`/sessao/GestaoEscolar/1/calendarioAcademico/${id}/eventos`);
  };

  return (
    <div className="listar-calendarios-container">
      <h2>Calendários Acadêmicos</h2>
      <ul>
        {calendarios.map(calendario => (
          <li
            key={calendario.id}
            onClick={() => handleCalendarioClick(calendario.id)}
            className="calendario-item"
          >
            {calendario.titulo} ({calendario.tipo_calendario})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListarCalendariosAcademicosPage;
