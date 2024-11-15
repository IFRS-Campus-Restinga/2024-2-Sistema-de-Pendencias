import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { calendarioAcademicoService } from '../../../../../services/calendarioAcademicoService';
import './listaEventosCalendarioAcademico.css';

const ListarEventosDoCalendarioPage = () => {
  const { idCalendario } = useParams();
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await calendarioAcademicoService.listarEventosDoCalendario(idCalendario);
        setEventos(response.data);
      } catch (error) {
        console.error("Erro ao buscar eventos do calendário acadêmico:", error);
        toast.error("Erro ao carregar eventos.", {
          position: "bottom-center",
          autoClose: 3000
        });
      }
    };
    fetchEventos();
  }, [idCalendario]);

  return (
    <div className="listar-eventos-container">
      <ToastContainer />
      <h2>Eventos do Calendário Acadêmico</h2>
      <ul>
        {eventos.map(evento => (
          <li key={evento.id}>
            {evento.titulo} - {new Date(evento.data_inicio).toLocaleDateString()} até {new Date(evento.data_fim).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListarEventosDoCalendarioPage;
