import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { eventoCalendarioService } from '../../../../../services/eventoCalendarioService';
import './eventoCalendario.css';
import validarEvento from "./validacoes";
import Button from "../../../../../components/Button/Button";
import FormContainer from "../../../../../components/FormContainer/FormContainer";

const EventoCalendarioPage = () => {
  const navigate = useNavigate();
  const { idEvento } = useParams(); // Identifica o ID do evento pela URL
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    tipo_calendario: 'Integrado',
    dia_todo: true,
    hora_inicio: '00:00',
    hora_fim: '00:00'
  });
  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    // Carrega os dados do evento se estivermos em modo de edição
    if (idEvento) {
      eventoCalendarioService.getEventoById(idEvento)
        .then(response => {
          const evento = response.data;
          setFormData({
            titulo: evento.titulo || '',
            descricao: evento.descricao || '',
            data_inicio: evento.data_inicio ? evento.data_inicio.split('T')[0] : '',
            data_fim: evento.data_fim ? evento.data_fim.split('T')[0] : '',
            tipo_calendario: evento.tipo_calendario || 'Integrado',
            dia_todo: evento.dia_todo || true,
            hora_inicio: evento.hora_inicio || '00:00',
            hora_fim: evento.hora_fim || '00:00'
          });
        })
        .catch(error => {
          console.error('Erro ao carregar os dados do evento:', error);
          toast.error("Falha ao carregar os dados do evento", {
            position: "bottom-center",
            autoClose: 3000
          });
        });
    }
  }, [idEvento]);

const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validarEvento(formData);

    if (Object.keys(validationErrors).length === 0) {
        setShowErrorMessage(false);
        try {
            const { dia_todo, hora_inicio, hora_fim, ...rest } = formData;
            const dataInicio = dia_todo ? `${rest.data_inicio}T00:00` : `${rest.data_inicio}T${hora_inicio}`;
            const dataFim = dia_todo ? `${rest.data_fim}T00:00` : `${rest.data_fim}T${hora_fim}`;

            const response = idEvento
                ? await eventoCalendarioService.update(idEvento, { ...rest, data_inicio: dataInicio, data_fim: dataFim })
                : await eventoCalendarioService.create({ ...rest, data_inicio: dataInicio, data_fim: dataFim });

            if (response && (response.status === 200 || response.status === 201)) {
                // ADICIONADO: Passando estado para exibir mensagem de sucesso ao retornar à página de calendário
                navigate("/sessao/Gestão Escolar/1/calendario", { state: { eventoCriado: !idEvento, eventoAtualizado: !!idEvento } });
            } else {
                throw new Error("Falha ao obter ID do evento criado.");
            }
        } catch (error) {
            console.error('Erro ao salvar evento:', error);

            if (error.response && error.response.data.mensagem === "Não existe um calendário acadêmico para este período.") {
                toast.error("Não é possível cadastrar um evento fora de um período letivo válido.", {
                    position: "bottom-center",
                    autoClose: 3000,
                    style: { backgroundColor: '#DC3545', color: '#fff', textAlign: 'center' },
                    progressStyle: { backgroundColor: '#fff' }
                });
            } else {
                toast.error("Falha ao salvar evento. Tente novamente.", {
                    position: "bottom-center",
                    autoClose: 3000,
                    style: { backgroundColor: '#DC3545', color: '#fff', textAlign: 'center' },
                    progressStyle: { backgroundColor: '#fff' }
                });
            }
        }
    } else {
        setErrors(validationErrors);
        setShowErrorMessage(true);
    }
};


  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
      try {
        await eventoCalendarioService.delete(idEvento);
        toast.success("Evento excluído com sucesso!", {
          position: "bottom-center",
          autoClose: 3000
        });

        navigate("/sessao/Gestão Escolar/1/calendario", { state: { eventoExcluido: true } });
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
        toast.error("Falha ao excluir evento. Tente novamente.", {
          position: "bottom-center",
          autoClose: 3000
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleDiaTodo = () => {
    setFormData({ ...formData, dia_todo: !formData.dia_todo });
  };

  return (
    <div className='perfilContainer'>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro de Evento">
        {showErrorMessage && <p style={{ color: 'red' }}>* Preencha todos os campos obrigatórios</p>}

        <label className='labelCustomizado'>Título
          <input
            id="titulo"
            type='text'
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            style={{ borderColor: errors.titulo ? 'red' : '' }}
          />
          {errors.titulo && <p className="erros">{errors.titulo}</p>}
        </label>

        <label className='labelCustomizado'>Descrição
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            style={{ borderColor: errors.descricao ? 'red' : '' }}
          />
          {errors.descricao && <p className="erros">{errors.descricao}</p>}
        </label>

        <label className='labelCustomizado'>Data Início
          <input
            type="date"
            name="data_inicio"
            value={formData.data_inicio}
            onChange={handleChange}
            style={{ borderColor: errors.data_inicio ? 'red' : '' }}
          />
          {errors.data_inicio && <p className="erros">{errors.data_inicio}</p>}
        </label>

        {!formData.dia_todo && (
          <label className='labelCustomizado'>Horário Início:
            <input
              id='hora_inicio'
              type="time"
              name="hora_inicio"
              value={formData.hora_inicio}
              onChange={handleChange}
              style={{ borderColor: errors.hora_inicio ? 'red' : '' }}
            />
          </label>
        )}

        <label className='labelCustomizado'>Data Fim
          <input
            type="date"
            name="data_fim"
            value={formData.data_fim}
            onChange={handleChange}
            style={{ borderColor: errors.data_fim ? 'red' : '' }}
          />
          {errors.data_fim && <p className="erros">{errors.data_fim}</p>}
        </label>

        {!formData.dia_todo && (
          <label className='labelCustomizado'>Horário Fim:
            <input
              id='hora_fim'
              type="time"
              name="hora_fim"
              value={formData.hora_fim}
              onChange={handleChange}
              style={{ borderColor: errors.hora_fim ? 'red' : '' }}
            />
          </label>
        )}

        <label className='labelCustomizado'>
          <input
            id='dia_todo'
            type="checkbox"
            checked={formData.dia_todo}
            onChange={toggleDiaTodo}
          />
          Dia Todo
        </label>

        <label className='labelCustomizado'>Tipo de Calendário
          <select
            id="tipo_calendario"
            name="tipo_calendario"
            value={formData.tipo_calendario}
            onChange={handleChange}
            style={{ borderColor: errors.tipo_calendario ? 'red' : '' }}
          >
            <option value="Integrado">Integrado</option>
            <option value="ProEJA">ProEJA</option>
          </select>
          {errors.tipo_calendario && <p className="erros">{errors.tipo_calendario}</p>}
        </label>

        <Button tipo='submit' text='Salvar Evento' />

        {/* Botão de exclusão aparece somente no modo de edição */}
        {idEvento && (
          <Button tipo='button' text='Excluir Evento' onClick={handleDelete} />
        )}
      </FormContainer>
    </div>
  );
};

export default EventoCalendarioPage;