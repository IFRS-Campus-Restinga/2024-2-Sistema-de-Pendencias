// EventoCalendarioPage.js
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { eventoCalendarioService } from '../../../../../services/eventoCalendarioService';
import CalendarioContainer from '../../../../../components/CalendarioContainer/CalendarioContainer';
import './eventoCalendario.css';
import validarEvento from "./validacoes";
import Button from "../../../../../components/Button/Button";
import FormContainer from "../../../../../components/FormContainer/FormContainer";
import Input from "../../../../../components/Input/Input";

const EventoCalendarioPage = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    tipo_calendario: 'EMI'
  });
  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [dataFimMin, setDataFimMin] = useState('');

const handleBlur = (e) => {
  const { name } = e.target;
  const validationErrors = validarEvento(formData, name);

  // Remove erro específico ao corrigir o campo
  if (!validationErrors[name]) {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  } else {
    setErrors((prevErrors) => ({ ...prevErrors, [name]: validationErrors[name] }));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validarEvento(formData);

    if (Object.keys(validationErrors).length === 0) {
      setShowErrorMessage(false);
      try {
        const response = await eventoCalendarioService.create(formData);
        if (response.status !== 201) throw new Error(response.error);

        toast.success("Evento criado com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff' },
          progressStyle: { backgroundColor: '#fff' }
        });

        setFormData({ titulo: '', descricao: '', data_inicio: '', data_fim: '', tipo_calendario: 'EMI' });
        setErrors({});
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

  return (
    <div className='perfilContainer'>
      <div className='containerForm'>
        <ToastContainer />
        <FormContainer onSubmit={handleSubmit} titulo="Cadastro de Evento">
          {showErrorMessage && <p style={{ color: 'red' }}>* Preencha todos os campos obrigatórios</p>}

          <br/>
          <label className='labelCustomizado'>Título
            <input id="titulo"
              type='text'
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ borderColor: errors.titulo ? 'red' : '' }}
            />
            {errors.titulo && <p className="erros">{errors.titulo}</p>}
          </label>

          <label className='labelCustomizado'>Descrição
            <textarea id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ borderColor: errors.descricao ? 'red' : '' }}
            />
            {errors.descricao && <p className="erros">{errors.descricao}</p>}
          </label>

          <label className='labelCustomizado'>Data Início
            <br/>
            <input
              type="date"
              name="data_inicio"
              value={formData.data_inicio}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ borderColor: errors.data_inicio ? 'red' : '' }}
            />
            {errors.data_inicio && <p className="erros">{errors.data_inicio}</p>}
          </label>

          <label className='labelCustomizado'>Data Fim
            <br/>
            <input
              type="date"
              name="data_fim"
              value={formData.data_fim}
              onChange={handleChange}
              onBlur={handleBlur}
              min={dataFimMin}
              style={{ borderColor: errors.data_fim ? 'red' : '' }}
            />
            {errors.data_fim && <p className="erros">{errors.data_fim}</p>}
          </label>
          <br/>

          <label className='labelCustomizado'>Tipo de Calendário
            <select id="tipo_calendario"
              name="tipo_calendario"
              value={formData.tipo_calendario}
              onChange={handleChange}
              style={{ borderColor: errors.tipo_calendario ? 'red' : '' }}
            >
              <option value="EMI">EMI</option>
              <option value="PROEJA">PROEJA</option>
            </select>
            {errors.tipo_calendario && <p className="erros">{errors.tipo_calendario}</p>}
          </label>

          <Button tipo='submit' text='Salvar Evento' />
        </FormContainer>
      </div>
    </div>
  );
};

export default EventoCalendarioPage;