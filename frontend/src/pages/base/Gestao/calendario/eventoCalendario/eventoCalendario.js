import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { eventoCalendarioService } from '../../../../../services/eventoCalendarioService';
import './eventoCalendario.css';
import validarEvento from "./validacoes";
import Button from "../../../../../components/Button/Button";
import FormContainer from "../../../../../components/FormContainer/FormContainer";

const EventoCalendarioPage = () => {
  const navigate = useNavigate();
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
  const [dataFimMin, setDataFimMin] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validarEvento(formData);

    if (Object.keys(validationErrors).length === 0) {
      setShowErrorMessage(false);
      try {
        const { dia_todo, hora_inicio, hora_fim, ...rest } = formData;
        const dataInicio = dia_todo ? `${rest.data_inicio}T00:00` : `${rest.data_inicio}T${hora_inicio}`;
        const dataFim = dia_todo ? `${rest.data_fim}T00:00` : `${rest.data_fim}T${hora_fim}`;
        
        const response = await eventoCalendarioService.create({ ...rest, data_inicio: dataInicio, data_fim: dataFim });
        if (response.status !== 201) throw new Error(response.error);
        navigate("/sessao/GestaoEscolar/1/calendario", { state: { eventoCriado: true } });
      } catch (error) {
        console.error('Erro ao criar evento!', error);
        toast.error("Falha ao criar evento. Tente novamente.", {
          position: "bottom-center",
          autoClose: 3000
        });
      }
    } else {
      setErrors(validationErrors);
      setShowErrorMessage(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'data_inicio') setDataFimMin(value);
  };

  const toggleDiaTodo = () => {
    setFormData({ ...formData, dia_todo: !formData.dia_todo });
  };

  return (
    <div className='perfilContainer'>
        <ToastContainer />
        <FormContainer onSubmit={handleSubmit} titulo="Cadastro de Evento">
          {showErrorMessage && <p style={{ color: 'red' }}>* Preencha todos os campos obrigatórios</p>}

          <br />
          <label className='labelCustomizado'>Título
            <input id="titulo"
              type='text'
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              style={{ borderColor: errors.titulo ? 'red' : '' }}
            />
            {errors.titulo && <p className="erros">{errors.titulo}</p>}
          </label>

          <label className='labelCustomizado'>Descrição
            <textarea id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              style={{ borderColor: errors.descricao ? 'red' : '' }}
            />
            {errors.descricao && <p className="erros">{errors.descricao}</p>}
          </label>

          <label className='labelCustomizado'>Data Início
            <br />
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
            <label className='labelCustomizado'>Horário:
              <input id='hora'
                type="time"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                style={{ borderColor: errors.hora_inicio ? 'red' : '' }}
              />
            </label>
          )}

          <label className='labelCustomizado'>Data Fim
            <br />
            <input
              type="date"
              name="data_fim"
              value={formData.data_fim}
              onChange={handleChange}
              min={dataFimMin}
              style={{ borderColor: errors.data_fim ? 'red' : '' }}
            />
            {errors.data_fim && <p className="erros">{errors.data_fim}</p>}
          </label>

          {!formData.dia_todo && (
            <label className='labelCustomizado'>Horário:
              <input
                id='hora'
                type="time"
                name="hora_fim"
                value={formData.hora_fim}
                onChange={handleChange}
                style={{ borderColor: errors.hora_fim ? 'red' : '' }}
              />
            </label>
          )}

          <label className='labelCustomizado'>
            <input id='dia_todo'
              type="checkbox"
              checked={formData.dia_todo}
              onChange={toggleDiaTodo}
            />
            Dia Todo
          </label>

          <label className='labelCustomizado'>Tipo de Calendário
            <select id="tipo_calendario"
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
        </FormContainer>
      </div>
  );
};

export default EventoCalendarioPage;
