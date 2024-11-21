import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ptBR } from 'date-fns/locale';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { eventoCalendarioService } from '../../../../services/eventoCalendarioService';
import { calendarioAcademicoService } from '../../../../services/calendarioAcademicoService';
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Switch from '../../../../components/Switch/Switch';
import Button from '../../../../components/Button/Button';
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
    const navigate = useNavigate();
    const [eventos, setEventos] = useState([]);
    const [calendarios, setCalendarios] = useState([]);
    const [modalidade, setModalidade] = useState('Integrado');
    const [calendarioSelecionado, setCalendarioSelecionado] = useState(null);
    const [eventosDoCalendario, setEventosDoCalendario] = useState([]); // Eventos do calendário selecionado
    const { eventoCriado, eventoAtualizado, eventoExcluido } = location.state || {};

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await eventoCalendarioService.listar();
                const eventosData = response.data.map(evento => ({
                    id: evento.id,
                    title: evento.titulo,
                    start: new Date(evento.data_inicio),
                    end: new Date(evento.data_fim),
                    allDay: false,
                    tipo_calendario: evento.tipo_calendario
                }));
                setEventos(eventosData);
            } catch (error) {
                console.error("Erro ao buscar eventos:", error);
            }
        };

        const fetchCalendarios = async () => {
            try {
                const response = await calendarioAcademicoService.listarCalendariosAcademicos();
                setCalendarios(response.data);
            } catch (error) {
                console.error("Erro ao buscar períodos letivos:", error);
            }
        };

        fetchEventos();
        fetchCalendarios();

        if (location.state?.calendarioCriado) {
            toast.success("Calendário Acadêmico criado com sucesso!", {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#28A745', color: '#fff' },
                progressStyle: { backgroundColor: '#fff' },
            });

            navigate(location.pathname, { replace: true });
        }

        if (eventoCriado) {
            toast.success("Evento criado com sucesso!", {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#28A745', color: '#fff' },
                progressStyle: { backgroundColor: '#fff' }
            });
        }

        if (eventoAtualizado) {
            toast.success("Evento atualizado com sucesso!", {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#28A745', color: '#fff' },
                progressStyle: { backgroundColor: '#fff' }
            });
        }

        if (eventoExcluido) {
            toast.success("Evento excluído com sucesso!", {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#28a745', color: '#fff' },
                progressStyle: { backgroundColor: '#fff' }
            });
        }
    }, [eventoCriado, eventoAtualizado, eventoExcluido, location.state, navigate]);

    const handleEventClick = (event) => {
        navigate(`/sessao/Gestão Escolar/1/calendario/evento/${event.id}`, { state: { evento: event } });
    };

    const handleCalendarioClick = async (calendario) => {
        setCalendarioSelecionado(calendario);
        try {
            const response = await calendarioAcademicoService.listarEventosDoCalendario(calendario.id);
            setEventosDoCalendario(response.data); // Atualiza os eventos relacionados ao calendário selecionado
        } catch (error) {
            console.error("Erro ao buscar eventos do calendário acadêmico:", error);
            toast.error("Erro ao carregar eventos do calendário acadêmico.", {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#DC3545', color: '#fff', textAlign: 'center' },
                progressStyle: { backgroundColor: '#fff' }
            });
        }
    };

    const handleVoltarClick = () => {
        setCalendarioSelecionado(null);
        setEventosDoCalendario([]);
    };

    const filteredEventos = calendarioSelecionado
        ? eventosDoCalendario.map(evento => ({
            id: evento.id,
            title: evento.titulo,
            start: new Date(evento.data_inicio),
            end: new Date(evento.data_fim),
            allDay: false
        }))
        : eventos.filter(evento => evento.tipo_calendario === modalidade);

    const filteredCalendarios = calendarios.filter(calendario => calendario.tipo_calendario === modalidade);

    const trocaModalidade = (novoValor) => {
        setModalidade(novoValor);
        setCalendarioSelecionado(null);
        setEventosDoCalendario([]);
    };

    return (
        <FormContainer titulo="Calendário de Eventos">
            <ToastContainer />
            <div className="calendario-page-container">
                <div className="calendario-container">
                    <Calendar
                        localizer={localizer}
                        events={filteredEventos}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        culture="pt-BR"
                        onSelectEvent={handleEventClick}
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
                            allDay: "Dia Todo",
                            noEventsInRange: "Nenhum evento neste período",
                            showMore: total => `+ Ver mais (${total})`
                        }}
                    />
                </div>
                <div className="calendarios-academicos-container">
                    <div className="switch-container">
                        <Switch
                            valor1="ProEJA"
                            valor2="Integrado"
                            valor={modalidade}
                            stateHandler={trocaModalidade}
                        />
                    </div>
                    {!calendarioSelecionado ? (
                        <>
                            <h3>Período Letivo - {modalidade}</h3>
                            <ul className="calendarios-list">
                                {filteredCalendarios.map(calendario => (
                                    <li
                                        key={calendario.id}
                                        className="calendario-item"
                                        onClick={() => handleCalendarioClick(calendario)}
                                    >
                                        {calendario.titulo}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                tipo="button"
                                text="Novo Período Letivo"
                                onClick={() => navigate("/sessao/Gestão Escolar/1/cadastroCalendarioAcademico")}
                            />
                        </>
                    ) : (
                        <>
                            <h3>Eventos - {calendarioSelecionado.titulo}</h3>
                            <ul className="eventos-list">
                                {eventosDoCalendario.map(evento => (
                                    <li key={evento.id}>
                                        {evento.titulo} - {new Date(evento.data_inicio).toLocaleDateString()} até {new Date(evento.data_fim).toLocaleDateString()}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                tipo="button"
                                text="Voltar"
                                onClick={handleVoltarClick}
                            />
                        </>
                    )}
                </div>
            </div>
        </FormContainer>
    );
};

export default CalendarioPage;
