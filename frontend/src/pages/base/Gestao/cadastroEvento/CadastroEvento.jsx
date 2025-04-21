import React, { useState, useEffect } from 'react';
import { useredirect, useLocation, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { eventoCalendarioService } from '../../../../services/eventoCalendarioService';
import styles from './CadastroEvento.module.css';
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Input from '../../../../components/Input/Input';

const CadastroEvento = () => {
  const location = useLocation()
  const redirect = useNavigate();
  const { state } = location
  const [erros, setErros] = useState({});
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    dia_todo: true,
  });

  useEffect(() => {

  }, [idEvento]);

  const handleSubmit = async (e) => {
    e.preventDefault();


  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "data_inicio") {
      setFormData((prevState) => {
        if (prevState.data_fim && prevState.data_fim < value) {
          return { ...prevState, data_inicio: value, data_fim: value };
        }
        return { ...prevState, data_inicio: value };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleDiaTodo = () => {
    setFormData({ ...formData, dia_todo: !formData.dia_todo });
  };

  return (
    <div className='perfilContainer'>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro de Evento" >
        {showErrorMessage && <p style={{ color: 'red' }}>* Preencha todos os campos obrigatórios</p>}

        <label className='labelCustomizado'>Título
          <Input
            id="titulo"
            type='text'
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            style={{ borderColor: erros.titulo ? 'red' : '' }}
          />
          {erros.titulo && <p className="erros">{erros.titulo}</p>}
        </label>

        <label className='labelCustomizado'>Descrição
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            style={{ borderColor: erros.descricao ? 'red' : '' }}
          />
          {erros.descricao && <p className="erros">{erros.descricao}</p>}
        </label>

        <label className='labelCustomizado'>Data Início
          <Input
            id="data_inicio"
            type="date"
            name="data_inicio"
            value={formData.data_inicio}
            onChange={(e) => {
              handleChange(e);
              const novaDataInicio = e.target.value;
              setFormData((prevState) => {
                if (prevState.data_fim && prevState.data_fim < novaDataInicio) {
                  return { ...prevState, data_fim: novaDataInicio };
                }
                return prevState;
              });
            }}
            style={{ borderColor: erros.data_inicio ? 'red' : '' }}
          />
          {erros.data_inicio && <p className="erros">{erros.data_inicio}</p>}
        </label>

        {!formData.dia_todo && (
          <label className='labelCustomizado'>Horário Início:
            <Input
              id='hora_inicio'
              type="time"
              name="hora_inicio"
              value={formData.hora_inicio}
              onChange={handleChange}
              style={{ borderColor: erros.hora_inicio ? 'red' : '' }}
            />
          </label>
        )}

        <label className='labelCustomizado'>Data Fim
          <Input
            id="data_fim"
            type="date"
            name="data_fim"
            value={formData.data_fim}
            onChange={handleChange}
            min={formData.data_inicio || new Date().toISOString().split('T')[0]} // Define o limite mínimo
            style={{ borderColor: erros.data_fim ? 'red' : '' }}
          />
          {erros.data_fim && <p className="erros">{erros.data_fim}</p>}
        </label>

        {!formData.dia_todo && (
          <label className='labelCustomizado'>Horário Fim:
            <Input
              id='hora_fim'
              type="time"
              name="hora_fim"
              value={formData.hora_fim}
              onChange={handleChange}
              style={{ borderColor: erros.hora_fim ? 'red' : '' }}
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
            style={{ borderColor: erros.tipo_calendario ? 'red' : '' }}
          >
            <option value="Integrado">Integrado</option>
            <option value="ProEJA">ProEJA</option>
          </select>
          {erros.tipo_calendario && <p className="erros">{erros.tipo_calendario}</p>}
        </label>

        <Button tipo='submit' text='Salvar Evento' />
        {idEvento && <Button tipo='button' text='Excluir Evento' onClick={handleDelete} />}
      </FormContainer>
    </div>
  );
};

export default CadastroEvento;