import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ptBR } from 'date-fns/locale';
import { format, parse, startOfWeek, getDay, isAfter, parseISO } from 'date-fns';
import FormContainer from "../../../../components/FormContainer/FormContainer";
import styles from './calendario.module.css';
import { calendarioAcademicoService } from '../../../../services/calendarioAcademicoService';
import Loading from '../../../../components/Loading/Loading';
import { AxiosError } from 'axios';

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

            if (res.data.eventos?.length > 0) {
                setEventos(res.data.eventos.map(e => ({
                    ...e,
                    start: parseISO(e.data_inicio),
                    end: parseISO(e.data_fim),
                })));
            };
            setCalendario(res.data.calendario)

            const hoje = new Date();
            const dataInicio = new Date(res.data.calendario.data_inicio);

            const data = isAfter(hoje, dataInicio) ? hoje : dataInicio

            setDataMinima(data);
        } catch (error) {
            if (error instanceof AxiosError){
                console.error(error.response?.data.message)
            } else{
                console.error(error)
            }
        } finally {
            setCarregando(false)
        }
    };

    const handleNavigate = (novaData, view) => {
        setDataAtual(novaData);
        setEventos([])
    };

    const handleDayClick = (slotInfo) => {
        const dataSelecionada = slotInfo.start;

        const fim = new Date(calendario.data_fim);

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
                                events={eventos}
                                startAccessor="start"
                                endAccessor="end"
                                titleAccessor="titulo"
                                style={{ height: 500 }}
                                min={dataMinima}
                                max={new Date(calendario.data_fim)}
                                culture="pt-BR"
                                onNavigate={handleNavigate}
                                selectable
                                onSelectSlot={handleDayClick}
                                dayPropGetter={(date) => {
                                    const fim = new Date(calendario.data_fim)

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
                                eventos.length > 0 ? (
                                    eventos.map((evento) => (
                                        <li className={styles.evento}>
                                            <Link to={`eventos/${evento.id}/editar/`} state={{ evento: evento.id, calendario: state }} style={{ textDecoration: 'none' }}>
                                                <p className={styles.tituloEvento}>
                                                    {evento.titulo}
                                                </p>
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <p className={styles.mensagem}>Nenhum evento encontrado para este mês</p>
                                )
                            }
                        </ul>
                    </div>
                )
            }
        </FormContainer>
    );
};

export default Calendario;