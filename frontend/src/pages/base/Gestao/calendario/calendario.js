import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ptBR } from 'date-fns/locale';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { eventoCalendarioService } from '../../../../services/eventoCalendarioService';
import FormContainer from "../../../../components/FormContainer/FormContainer";
import './calendario.css';

const locales = {
    'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales,
});

const CalendarioPage = () => {
    const location = useLocation();
    const [eventos, setEventos] = useState([]);
    const { eventoCriado } = location.state || {};


    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await eventoCalendarioService.listar();
                const eventosData = response.data.map(evento => ({
                    title: evento.titulo,
                    start: new Date(evento.data_inicio),
                    end: new Date(evento.data_fim),
                    allDay: false,
                }));
                setEventos(eventosData);
            } catch (error) {
                console.error("Erro ao buscar eventos:", error);
            }
        };

        fetchEventos();

        if (eventoCriado) {
            toast.success("Evento criado com sucesso!", {
              position: "bottom-center",
              autoClose: 3000,
              style: { backgroundColor: '#28A745', color: '#fff' },
              progressStyle: { backgroundColor: '#fff' }
            });
          }
        }, [eventoCriado])

    return (
        <FormContainer titulo="Calendário de Eventos">
            <ToastContainer />
            <div className="calendario-container">
                <Calendar
                    localizer={localizer}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    culture="pt-BR"
                    messages={{
                        next: "Próximo",
                        previous: "Anterior",
                        today: "Hoje",
                        month: "Mês",
                        week: "Semana",
                        day: "Dia",
                        agenda: "Agenda",
                        date: "Data",
                        time: "Hora",
                        event: "Evento",
                        noEventsInRange: "Nenhum evento neste período",
                        showMore: total => `+ Ver mais (${total})`
                    }}
                />
            </div>
        </FormContainer>
    );
};

export default CalendarioPage;
