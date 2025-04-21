import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ptBR } from 'date-fns/locale';
import { format, parse, startOfWeek, getDay, isAfter } from 'date-fns';
import FormContainer from "../../../../components/FormContainer/FormContainer";
import styles from './calendario.module.css';
import { calendarioAcademicoService } from '../../../../services/calendarioAcademicoService';
import Loading from '../../../../components/Loading/Loading';

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

const Calendario = () => {
    const location = useLocation();
    const redirect = useNavigate()
    const { state } = location
    const [carregando, setCarregando] = useState(true)
    const [calendario, setCalendario] = useState({})
    const [eventos, setEventos] = useState([]);
    const [dataAtual, setDataAtual] = useState(new Date());
    const [dataMinima, setDataMinima] = useState()

    const fetchCalendario = async () => {
        try {
            const mes = dataAtual.getMonth() + 1;
            const ano = dataAtual.getFullYear();

            const res = await calendarioAcademicoService.porId(state, mes, ano)

            if (res.status !== 200) throw new Error(res.message)

            if (res.data.eventos?.length > 0) setEventos(res.data.eventos);
            setCalendario(res.data.calendario)

            const hoje = new Date();
            const dataInicio = parse(res.data.calendario.data_inicio, 'dd/MM/yyyy', new Date());

            const data = isAfter(hoje, dataInicio) ? hoje : dataInicio

            setDataMinima(data);
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
        } finally {
            setCarregando(false)
        }
    };

    const handleNavigate = (novaData, view) => {
        setDataAtual(novaData);
    };

    const handleDayClick = (slotInfo) => {
        const dataSelecionada = slotInfo.start;

        const fim = parse(calendario.data_fim, 'dd/MM/yyyy', new Date());

        if (dataSelecionada < dataMinima || dataSelecionada > fim) {
            toast.warn("Data fora do período do calendário");
            return;
        }

        redirect('/Gestão Escolar/cadastroEvento/', {
            state: {
                dataSelecionada: format(dataSelecionada, 'yyyy-MM-dd'),
                calendario: state,
            },
        });
    };

    const formattedEvents = eventos.map(event => ({
        ...event,
        start: new Date(event.start),
        end: event.end ? new Date(event.end) : new Date(event.start),
        allDay: event.allDay
    }));

    useEffect(() => {
        fetchCalendario();
    }, [dataAtual, state]);

    return (
        <FormContainer titulo="Calendário de Eventos" comprimento={'90%'} textoInfo={'Clique em um slot do calendário para adicionar um novo evento\n\nOu clique em um evento na lista ao lado para visualizar/editar informações sobre um evento\n\nSó poderão ser adicionados, eventos que estejam dentro do intervalo do calendário'}>
            <ToastContainer />
            {
                carregando ? (
                    <Loading border={'green'} />
                ) : (
                    <div className={styles.container}>
                        <div className={styles.calendarioContainer}>
                            <Calendar
                                localizer={localizer}
                                events={formattedEvents}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 500 }}
                                min={dataMinima}
                                max={parse(calendario.data_fim, 'dd/MM/yyyy', new Date())}
                                culture="pt-BR"
                                onNavigate={handleNavigate}
                                selectable
                                onSelectSlot={handleDayClick}
                                dayPropGetter={(date) => {
                                    const fim = parse(calendario.data_fim, 'dd/MM/yyyy', new Date());

                                    const isInRange = date >= dataMinima && date <= fim;

                                    return {
                                        className: isInRange ? styles.slotValido : styles.slotDesabilitado,
                                    };
                                }}
                                eventPropGetter={(event) => ({
                                    style: {
                                        backgroundColor: '#006b3f',
                                        color: 'white',
                                        borderRadius: '4px',
                                        padding: '2px 4px',
                                        fontSize: '12px',
                                    },
                                })}
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
                        <ul className={styles.containerEventos}>
                            Lista de eventos
                            {
                                formattedEvents.length > 0 ? (
                                    formattedEvents.map((evento) => (
                                        <li className={styles.evento}>
                                            <Link to={`eventos/${evento.id}/`} style={{ textDecoration: 'none' }}>
                                                <p className={styles.tituloEvento}>
                                                    {evento.title}
                                                </p>
                                            </Link>
                                        </li>
                                    ))
                                ) : null
                            }
                        </ul>
                    </div>
                )
            }
        </FormContainer>
    );
};

export default Calendario;