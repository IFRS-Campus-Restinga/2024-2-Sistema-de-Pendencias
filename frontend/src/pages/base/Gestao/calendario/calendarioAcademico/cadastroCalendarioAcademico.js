import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { calendarioAcademicoService } from '../../../../../services/calendarioAcademicoService';
import Button from "../../../../../components/Button/Button";
import FormContainer from "../../../../../components/FormContainer/FormContainer";

const CadastroCalendarioAcademicoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    data_inicio: '',
    data_fim: '',
    tipo_calendario: 'Integrado'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div className='perfilContainer'>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro de Calendário Acadêmico">
        <label className='labelCustomizado'>Título
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </label>
        <label className='labelCustomizado'>Data Início
          <input
            type="date"
            name="data_inicio"
            value={formData.data_inicio}
            onChange={handleChange}
            required
          />
        </label>
        <label className='labelCustomizado'>Data Fim
          <input
            type="date"
            name="data_fim"
            value={formData.data_fim}
            onChange={handleChange}
            required
          />
        </label>
        <label className='labelCustomizado'>Tipo de Calendário
          <select
            name="tipo_calendario"
            value={formData.tipo_calendario}
            onChange={handleChange}
          >
            <option value="Integrado">Integrado</option>
            <option value="ProEJA">ProEJA</option>
          </select>
        </label>
        <Button tipo='submit' text='Cadastrar Calendário Acadêmico' />
      </FormContainer>
    </div>
  );
};

export default CadastroCalendarioAcademicoPage;
