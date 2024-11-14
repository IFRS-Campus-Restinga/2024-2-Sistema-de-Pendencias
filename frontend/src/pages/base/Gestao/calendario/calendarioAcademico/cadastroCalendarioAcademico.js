import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { calendarioAcademicoService } from '../../../../../services/calendarioAcademicoService';
import { validarCadastroCalendarioAcademico } from './validacoesCadastroCalendarioAcademico';
import Button from "../../../../../components/Button/Button";
import FormContainer from "../../../../../components/FormContainer/FormContainer";
import './cadastroCalendarioAcademico.css';

const CadastroCalendarioAcademicoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    data_inicio: '',
    data_fim: '',
    tipo_calendario: 'Integrado'
  });
  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDataInicioChange = (e) => {
    const dataInicio = e.target.value;
    setFormData({ ...formData, data_inicio: dataInicio, data_fim: '' });
  };

  const validateForm = () => {
    const validationErrors = validarCadastroCalendarioAcademico(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowErrorMessage(false);
      try {
        await calendarioAcademicoService.criarCalendarioAcademico(formData);
        toast.success("Calendário Acadêmico criado com sucesso!", {
          position: "bottom-center",
          autoClose: 3000
        });
        navigate("/sessao/GestaoEscolar/1/listarCalendariosAcademicos");
      } catch (error) {
        console.error('Erro ao cadastrar calendário acadêmico:', error);
        toast.error("Erro ao cadastrar calendário acadêmico.", {
          position: "bottom-center",
          autoClose: 3000
        });
      }
    } else {
      setShowErrorMessage(true);
    }
  };

  return (
    <div className='perfilContainer'>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro de Calendário Acadêmico">
        {showErrorMessage && <p style={{ color: 'red' }}>* Preencha todos os campos obrigatórios corretamente.</p>}

        <label className='labelCustomizado'>Título
          <input
            id="titulo"
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className={errors.titulo ? 'inputErro' : ''}
            required
          />
          {errors.titulo && <p className="erros">{errors.titulo}</p>}
        </label>

        <div className="labelCustomizado">Data Início</div>
        <input
          id="data_inicio"
          type="date"
          name="data_inicio"
          value={formData.data_inicio}
          onChange={handleDataInicioChange}
          onFocus={(e) => e.target.showPicker()} // Abre o seletor de data ao focar no campo
          className={errors.data_inicio ? 'inputErro' : ''}
          required
        />
        {errors.data_inicio && <p className="erros">{errors.data_inicio}</p>}

        <div className="labelCustomizado">Data Fim</div>
        <input
          id="data_fim"
          type="date"
          name="data_fim"
          value={formData.data_fim}
          min={formData.data_inicio || undefined}
          onChange={handleChange}
          onFocus={(e) => e.target.showPicker()} // Abre o seletor de data ao focar no campo
          className={errors.data_fim ? 'inputErro' : ''}
          required
        />
        {errors.data_fim && <p className="erros">{errors.data_fim}</p>}

        <label className='labelCustomizado'>Tipo de Calendário
          <select
            id="tipo_calendario"
            name="tipo_calendario"
            value={formData.tipo_calendario}
            onChange={handleChange}
            className={errors.tipo_calendario ? 'inputErro' : ''}
          >
            <option value="Integrado">Integrado</option>
            <option value="ProEJA">ProEJA</option>
          </select>
          {errors.tipo_calendario && <p className="erros">{errors.tipo_calendario}</p>}
        </label>

        <Button tipo='submit' text='Cadastrar Calendário Acadêmico' />
      </FormContainer>
    </div>
  );
};

export default CadastroCalendarioAcademicoPage;
