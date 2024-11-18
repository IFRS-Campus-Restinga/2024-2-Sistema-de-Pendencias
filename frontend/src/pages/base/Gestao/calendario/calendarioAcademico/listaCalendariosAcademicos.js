import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calendarioAcademicoService } from '../../../../../services/calendarioAcademicoService';
import './listaCalendariosAcademicos.css';

const ListarCalendariosAcademicosPage = () => {
  const navigate = useNavigate();
  const [calendariosIntegrado, setCalendariosIntegrado] = useState([]);
  const [calendariosProEJA, setCalendariosProEJA] = useState([]);

  useEffect(() => {
    const fetchCalendarios = async () => {
      try {
        const response = await calendarioAcademicoService.listarCalendariosAcademicos();
        const calendarios = response.data;

        // Separar os calendários por tipo
        setCalendariosIntegrado(calendarios.filter(cal => cal.tipo_calendario === 'Integrado'));
        setCalendariosProEJA(calendarios.filter(cal => cal.tipo_calendario === 'ProEJA'));
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
      <div className="calendarios-columns">
        <div className="coluna-integrado">
          <h3 className='h3CalendariosAcademicos'>Integrado</h3>
          <ul>
            {calendariosIntegrado.map(calendario => (
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
        <div className="coluna-proeja">
          <h3>ProEJA</h3>
          <ul>
            {calendariosProEJA.map(calendario => (
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
      </div>
    </div>
  );
};

export default ListarCalendariosAcademicosPage;
