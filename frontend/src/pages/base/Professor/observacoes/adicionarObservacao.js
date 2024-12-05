import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Button from '../../../../components/Button/Button';
import Input from '../../../../components/Input/Input';
import { observacaoService } from '../../../../services/observacaoService';

const AdicionarObservacao = () => {
  const { usuarioId, pedTipo, pedId, observacaoId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    parecer: '',
    status: '',
    data_insercao: '', // Armazenando apenas para exibição
  });

  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Função de validação de formulário
  const validarFormulario = (data) => {
    const errors = {};
    if (!data.parecer) errors.parecer = 'O parecer é obrigatório';
    if (!data.status) errors.status = 'O status é obrigatório';
    return errors;
  };

  // Função para buscar dados de uma observação para edição
  const buscarObservacao = async () => {
    try {
      const response = await observacaoService.buscarObservacao(pedTipo, pedId, observacaoId);
      if (response) {
        setFormData({
          parecer: response.parecer,
          status: response.status,
          data_insercao: response.data_insercao, // Apenas para exibição
        });
      } else {
        toast.error('Observação não encontrada', {
          position: 'bottom-center',
          autoClose: 3000,
          style: { backgroundColor: '#d11c28', color: '#fff' },
        });
      }
    } catch (error) {
      console.error('Erro ao buscar observação:', error);
      toast.error('Erro ao buscar observação. Tente novamente.', {
        position: 'bottom-center',
        autoClose: 3000,
        style: { backgroundColor: '#d11c28', color: '#fff' },
      });
    }
  };

  // UseEffect para buscar dados da observação quando o componente for carregado
  useEffect(() => {
    if (observacaoId) {
      buscarObservacao();
    }
  }, [observacaoId]);

  // Função de envio do formulário (para edição ou criação)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validarFormulario(formData);
    if (Object.keys(validationErrors).length === 0) {
      setShowErrorMessage(false);

      // Criar payload excluindo data_insercao
      const payload = {
        parecer: formData.parecer,
        status: formData.status,
        ...(pedTipo === "emi" && { ped_emi: pedId }),
        ...(pedTipo === "proeja" && { ped_proeja: pedId }),
      };

      try {
        let response;
        if (observacaoId) {
          response = await observacaoService.editarObservacao(pedTipo, pedId, observacaoId, payload);
        } else {
          response = await observacaoService.adicionarObservacao(pedTipo, pedId, payload);
        }

        if (response.id) {
          toast.success(observacaoId ? 'Observação atualizada com sucesso!' : 'Observação cadastrada com sucesso!', {
            position: 'bottom-center',
            autoClose: 3000,
            style: { backgroundColor: '#28A745', color: '#fff' },
            progressStyle: { backgroundColor: '#fff' },
          });

          // Redirecionar após o sucesso da operação
          navigate(`/sessao/Professor/${usuarioId}/observacoes/${pedTipo}/${pedId}/`);
        } else {
          toast.error('Falha ao salvar a observação. Tente novamente.', {
            position: 'bottom-center',
            autoClose: 3000,
            style: { backgroundColor: '#d11c28', color: '#fff' },
            progressStyle: { backgroundColor: '#fff' },
          });
        }
      } catch (error) {
        console.error('Erro ao salvar observação:', error);
        toast.error('Falha ao salvar observação. Tente novamente.', {
          position: 'bottom-center',
          autoClose: 3000,
          style: { backgroundColor: '#d11c28', color: '#fff' },
          progressStyle: { backgroundColor: '#fff' },
        });
      }
    } else {
      setErrors(validationErrors);
      setShowErrorMessage(true);
    }
  };

  // Função chamada ao sair de um campo de entrada para validar individualmente
  const handleBlur = (campo) => {
    const error = validarFormulario({ [campo]: formData[campo] })[campo];
    setErrors((prevErrors) => ({
      ...prevErrors,
      [campo]: error ? error : undefined,
    }));
  };

  // Definição das opções de status
  const statusOptions = [
    { value: 'Criada', label: 'Criada' },
    { value: 'Em Atraso', label: 'Em Atraso' },
    { value: 'Em Andamento', label: 'Em Andamento' },
    { value: 'Finalizada', label: 'Finalizada' },
    { value: 'Desativado', label: 'Desativado' },
  ];

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo={observacaoId ? 'Editar Observação' : 'Adicionar Observação'} comprimento="60%">
        {showErrorMessage && <p style={{ color: 'red' }}>* Preencha os campos obrigatórios</p>}

        {/* Campo Parecer */}
        <div className="form-group">
          <label htmlFor="parecer" className="labelCadastroAluno">Parecer</label>
          <Input
            tipo="textarea"
            valor={formData.parecer}
            onChange={(e) => setFormData({ ...formData, parecer: e.target.value })}
            onBlur={() => handleBlur('parecer')}
            erro={errors.parecer}
            multiline
          />
          {errors.parecer && <p className="erros">{errors.parecer}</p>}
        </div>

        {/* Campo Status (Select) */}
        <div className="form-group">
          <label htmlFor="status" className="labelCadastroAluno">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            onBlur={() => handleBlur('status')}
            className={`form-control ${errors.status ? 'is-invalid' : ''}`}
          >
            <option value="">Selecione o Status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.status && <p className="erros">{errors.status}</p>}
        </div>

        {/* Exibindo Data de Inserção */}
        {formData.data_insercao && (
          <div className="form-group">
            <label htmlFor="data_insercao" className="labelCadastroAluno">Data de Inserção</label>
            <p>{new Date(formData.data_insercao).toLocaleString()}</p>
          </div>
        )}

        <div className="ajuste-button">
          <button type="submit">{observacaoId ? 'Atualizar Observação' : 'Cadastrar Observação'}</button>
        </div>
      </FormContainer>
    </>
  );
};

export default AdicionarObservacao;
