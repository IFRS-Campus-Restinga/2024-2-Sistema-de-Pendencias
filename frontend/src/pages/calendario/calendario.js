// CalendarioPage.js
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { eventoService } from '../../services/eventoService'
import CalendarioContainer from '../../components/CalendarioContainer/CalendarioContainer';

const CalendarioPage = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_inicio: '',
    data_fim: ''
  });
  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await eventoService.getAll();
        setEventos(response.data);
      } catch (error) {
        console.error('Erro ao carregar eventos!', error);
      }
    };
    fetchEventos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {}; // Implementar validação de campos
    if (Object.keys(validationErrors).length === 0) {
      setShowErrorMessage(false);
      try {
        const response = await eventoService.create(formData);
        if (response.status !== 201) throw new Error(response.error);

        setFormData({ titulo: '', descricao: '', data_inicio: '', data_fim: '' });
        setErrors({});
        toast.success("Evento criado com sucesso!", { position: "bottom-center", autoClose: 3000 });
        setEventos([...eventos, response.data]); // Adiciona o novo evento à lista de eventos
      } catch (error) {
        console.error('Erro ao criar evento!', error);
        toast.error("Falha ao criar evento. Tente novamente.", { position: "bottom-center", autoClose: 3000 });
      }
    } else {
      setErrors(validationErrors);
      setShowErrorMessage(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer />
      <CalendarioContainer onSubmit={handleSubmit} titulo="Cadastro de Evento">
        {showErrorMessage && <p style={{ color: 'red' }}>* Preencha todos os campos obrigatórios</p>}
        <div className="campoEvento">
          <label htmlFor="titulo" className="labelEvento">Título:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Título do evento"
            style={{ borderColor: errors.titulo ? 'red' : '' }}
          />
          {errors.titulo && <p className="erros">{errors.titulo}</p>}
        </div>
        <div className="campoEvento">
          <label htmlFor="descricao" className="labelEvento">Descrição:</label>
          <br/>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descrição do evento"
            style={{ borderColor: errors.descricao ? 'red' : '' }}
          />
          {errors.descricao && <p className="erros">{errors.descricao}</p>}
        </div>
        <div className="campoEvento">
          <label htmlFor="data_inicio" className="labelEvento">Data Início:</label>
          <input
            type="date"
            id="data_inicio"
            name="data_inicio"
            value={formData.data_inicio}
            onChange={handleChange}
            style={{ borderColor: errors.data_inicio ? 'red' : '' }}
          />
          {errors.data_inicio && <p className="erros">{errors.data_inicio}</p>}
        </div>
        <div className="campoEvento">
          <label htmlFor="data_fim" className="labelEvento">Data Fim:</label>
          <input
            type="date"
            id="data_fim"
            name="data_fim"
            value={formData.data_fim}
            onChange={handleChange}
            style={{ borderColor: errors.data_fim ? 'red' : '' }}
          />
          {errors.data_fim && <p className="erros">{errors.data_fim}</p>}
        </div>
      </CalendarioContainer>
    </>
  );
};

export default CalendarioPage;
