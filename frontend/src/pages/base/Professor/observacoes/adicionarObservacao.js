import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Button from '../../../../components/Button/Button';
import Input from '../../../../components/Input/Input';
import { observacaoService } from '../../../../services/observacaoService';

const AdicionarObservacao = () => {
  const { pedId } = useParams(); // Captura o ID do PED da URL

  const [formData, setFormData] = useState({
    parecer: '',
    status: '',
  });

  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [dataInsercao, setDataInsercao] = useState(null); // Estado para armazenar a data de inserção

  // Valida os campos do formulário
  const validarFormulario = (data) => {
    const errors = {};
    if (!data.parecer) errors.parecer = 'O parecer é obrigatório';
    if (!data.status) errors.status = 'O status é obrigatório';
    return errors;
  };

  // Submete o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validarFormulario(formData);
    if (Object.keys(validationErrors).length === 0) {
      setShowErrorMessage(false);

      const payload = {
        parecer: formData.parecer,
        status: formData.status,
      };

      try {
        const response = await observacaoService.adicionarObservacao(pedId, payload);

        // Verificar o código de status HTTP para garantir que a requisição foi bem-sucedida
        if (response && response.status === 201) {
          toast.success('Observação cadastrada com sucesso!', {
            position: 'bottom-center',
            autoClose: 3000,
            style: { backgroundColor: '#28A745', color: '#fff' },
            progressStyle: { backgroundColor: '#fff' },
          });

          // Exibe a data de inserção
          if (response.data_insercao) {
            setDataInsercao(response.data_insercao);
          }

          // Limpar os campos do formulário após o sucesso (opcional)
          setFormData({
            parecer: '',
            status: '',
          });
        } else {
          toast.error('Falha ao salvar a observação. Tente novamente.', {
            position: 'bottom-center',
            autoClose: 3000,
            style: { backgroundColor: '#d11c28', color: '#fff' },
          });
        }
      } catch (error) {
        console.error('Erro ao salvar observação:', error);
        toast.error('Erro ao salvar observação. Tente novamente.', {
          position: 'bottom-center',
          autoClose: 3000,
          style: { backgroundColor: '#d11c28', color: '#fff' },
        });
      }
    } else {
      setErrors(validationErrors);
      setShowErrorMessage(true);
    }
  };

  // Define as opções de status
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
      <FormContainer onSubmit={handleSubmit} titulo="Adicionar Observação">
        {showErrorMessage && <p style={{ color: 'red' }}>* Preencha os campos obrigatórios</p>}

        {/* Campo Parecer */}
        <div className="form-group">
          <label htmlFor="parecer">Parecer</label>
          <Input
            tipo="textarea"
            valor={formData.parecer}
            onChange={(e) => setFormData({ ...formData, parecer: e.target.value })}
            erro={errors.parecer}
            multiline
          />
          {errors.parecer && <p className="erros">{errors.parecer}</p>}
        </div>

        {/* Campo Status */}
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className={`form-control ${errors.status ? 'is-invalid' : ''}`}
          >
            <option value="">Selecione o Status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.status && <p className="erros">{errors.status}</p>}
        </div>

        {/* Exibe a data de inserção, se disponível */}
        {dataInsercao && (
          <div className="alert alert-info">
            <p>Observação cadastrada em: {dataInsercao}</p>
          </div>
        )}

        <div>
          <Button tipo="submit" text="Cadastrar Observação" />
        </div>
      </FormContainer>
    </>
  );
};

export default AdicionarObservacao;
