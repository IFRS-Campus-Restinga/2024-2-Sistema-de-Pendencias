import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
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
    const [eventos, setEventos] = useState([]);

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
    }, []);

    return (
        <FormContainer titulo="Calendário de Eventos">
            <div className="calendario-container">
                <Calendar
                    localizer={localizer}
                    events={eventos}  // Exibindo os eventos
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