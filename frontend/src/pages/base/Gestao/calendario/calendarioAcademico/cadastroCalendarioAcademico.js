import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { calendarioAcademicoService } from '../../../../../services/calendarioAcademicoService';
import { validarCadastroCalendarioAcademico } from './validacoesCadastroCalendarioAcademico';
import Button from "../../../../../components/Button/Button";
import FormContainer from "../../../../../components/FormContainer/FormContainer";
import './cadastroCalendarioAcademico.css';

const CadastroCalendarioAcademicoPage = () => {
  const navigate = useNavigate();
  const { idCalendario } = useParams(); // Verifica se há um ID para edição
  const [formData, setFormData] = useState({
    titulo: '',
    data_inicio: '',
    data_fim: '',
    tipo_calendario: 'Integrado',
  });
  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Carrega os dados existentes se estiver no modo de edição
  useEffect(() => {
    if (idCalendario) {
      calendarioAcademicoService.obterCalendarioAcademico(idCalendario)
        .then((response) => {
          const calendario = response.data;
          setFormData({
            titulo: calendario.titulo || '',
            data_inicio: calendario.data_inicio ? calendario.data_inicio.split('T')[0] : '',
            data_fim: calendario.data_fim ? calendario.data_fim.split('T')[0] : '',
            tipo_calendario: calendario.tipo_calendario || 'Integrado',
          });
        })
        .catch((error) => {
          console.error('Erro ao carregar calendário acadêmico:', error);
          toast.error("Erro ao carregar os dados do calendário acadêmico.", {
            position: "bottom-center",
            autoClose: 3000,
          });
        });
    }
  }, [idCalendario]);

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
        const response = idCalendario
          ? await calendarioAcademicoService.atualizarCalendarioAcademico(idCalendario, formData)
          : await calendarioAcademicoService.criarCalendarioAcademico(formData);

        if (![200, 201].includes(response.status)) throw new Error(response.error);

        navigate("/sessao/Gestão Escolar/1/calendario", {
          state: {
            calendarioCriado: !idCalendario,
            calendarioAtualizado: !!idCalendario,
            mensagemSucesso: idCalendario
              ? "Período Letivo atualizado com sucesso!"
              : "Período Letivo cadastrado com sucesso!",
          },
        });
      } catch (error) {
        console.error('Erro ao salvar calendário acadêmico:', error);

        // Verifica o código de erro retornado
        if (error.response && error.response.status === 500) {
          toast.error("Já existe um período letivo para este tipo de calendário.", {
            position: "bottom-center",
            autoClose: 3000,
            style: { backgroundColor: '#d11c28', color: '#fff' },
            progressStyle: { backgroundColor: '#fff' },
          });
        } else if (error.response && error.response.status === 409) {
          toast.error("ERRO: Existem eventos fora do novo período selecionado! Verifique os eventos neste intervalo de tempo.", {
            position: "bottom-center",
            autoClose: 3000,
            style: { backgroundColor: '#d11c28', color: '#fff' },
            progressStyle: { backgroundColor: '#fff' },
          });
        } else {
          // Erro genérico
          toast.error("Falha ao salvar calendário acadêmico. Tente novamente.", {
            position: "bottom-center",
            autoClose: 3000,
            style: { backgroundColor: '#d11c28', color: '#fff' },
            progressStyle: { backgroundColor: '#fff' },
          });
        }
      }
    } else {
      setShowErrorMessage(true);
    }
  };

  return (
    <div className="perfilContainer">
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo={idCalendario ? "Editar Calendário Acadêmico" : "Cadastro de Calendário Acadêmico"}>
        {showErrorMessage && <p style={{ color: 'red' }}>* Preencha todos os campos obrigatórios corretamente.</p>}

        <label className="labelCustomizado">Título
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
          onFocus={(e) => e.target.showPicker()}
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
          onFocus={(e) => e.target.showPicker()}
          className={errors.data_fim ? 'inputErro' : ''}
          required
        />
        {errors.data_fim && <p className="erros">{errors.data_fim}</p>}

        <label className="labelCustomizado">Tipo de Calendário
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

        <Button tipo="submit" text={idCalendario ? "Salvar Alterações" : "Cadastrar Periodo Letivo"} />
      </FormContainer>
    </div>
  );
};

export default CadastroCalendarioAcademicoPage;
