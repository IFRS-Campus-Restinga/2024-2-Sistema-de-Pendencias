import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ptBR } from 'date-fns/locale';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import FormContainer from "../../../../components/FormContainer/FormContainer";
import styles from './calendario.module.css';
import { calendarioAcademicoService } from '../../../../services/calendarioAcademicoService';

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
    const [eventos, setEventos] = useState([]);
    const [dataAtual, setDataAtual] = useState(new Date());

    const fetchEventos = async () => {
        try {
            const mes = dataAtual.getMonth() + 1;
            const ano = dataAtual.getFullYear();

            const res = await calendarioAcademicoService.listarEventos(state, mes, ano)

            if (res.data.length > 0) setEventos(res.data);
        } catch (error) {
            toast.error('Erro ao carregar eventos');
            console.error('Erro ao buscar eventos:', error);
        }
    };

    const handleNavigate = (novaData, view) => {
        setDataAtual(novaData);
    };

    const handleDayClick = (slotInfo) => {
        const dataSelecionada = format(slotInfo.start, 'yyyy-MM-dd');

        redirect('/Gestão Escolar/cadastroEvento/', { state: { dataSelecionada, calendario: state } })
    }

    useEffect(() => {
        fetchEventos();
    }, [dataAtual, state]);

    return (
        <FormContainer titulo="Calendário de Eventos" comprimento={'90%'} textoInfo={'Clique em um slot do calendário para adicionar um novo evento\n\nOu clique em um evento na lista ao lado para visualizar/editar informações sobre um evento'}>
            <ToastContainer />
            <div className={styles.container}>
                <div className={styles.calendarioContainer}>
                    <Calendar
                        localizer={localizer}
                        events={eventos}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        culture="pt-BR"
                        onNavigate={handleNavigate}
                        selectable
                        onSelectSlot={handleDayClick}
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
                    {
                        eventos.length > 0 ? (
                            eventos.map((evento) => (
                                <li className={styles.evento}>
                                    <Link to={`eventos/${evento.id}/`}>
                                        {evento.titulo}
                                    </Link>
                                </li>
                            ))
                        ) : null
                    }
                </ul>
            </div>
        </FormContainer>
    );
};

export default Calendario;