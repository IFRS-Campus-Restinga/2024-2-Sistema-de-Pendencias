import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Button from '../../../../components/Button/Button';
import { observacaoService } from '../../../../services/observacaoService';
import './adicionarObservacao.css';

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

          // Exibe a data de inserção formatada
          if (response.data_insercao) {
            const formattedDate = moment(response.data_insercao).format('DD/MM/YYYY HH:mm:ss');
            setDataInsercao(formattedDate);
            console.log("Data de inserção formatada:", formattedDate); // Depuração
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

  // Log de depuração da data de inserção
  useEffect(() => {
    console.log("Data de inserção atual:", dataInsercao);
  }, [dataInsercao]);

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Adicionar Observação">
        {showErrorMessage && <p style={{ color: 'red' }}>* Preencha os campos obrigatórios</p>}

        {/* Seção do Parecer */}
        <section className="sectionCadastroObservacao">
          <div className="divCadastroObservacao textarea">
            <label className="labelCadastroObservacao">
              Parecer *
              <textarea
                name="parecer"
                className={
                  errors.parecer ? 'errorTextAreaCadastroObservacao' : 'textAreaCadastroObservacao'
                }
                onChange={(e) => setFormData({ ...formData, parecer: e.target.value })}
                value={formData.parecer}
              />
              {errors.parecer && <p className="errorMessage">{errors.parecer}</p>}
            </label>
          </div>
        </section>

        {/* Seção do Status */}
        <section className="sectionCadastroObservacao">
          <div className="divCadastroObservacao">
            <label className="labelCadastroObservacao">
              Status *
              <select
                name="status"
                className={errors.status ? 'errorSelectCadastroObservacao' : 'selectCadastroObservacao'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                value={formData.status}
              >
                <option value="">Selecione o status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.status && <p className="errorMessage">{errors.status}</p>}
            </label>
          </div>
        </section>

        {/* Exibe a data de inserção, se disponível */}
        {dataInsercao && (
          <section className="sectionCadastroObservacao">
            <div className="divCadastroObservacao alert alert-info">
              <p>Observação cadastrada em: {dataInsercao}</p>
            </div>
          </section>
        )}

        <div>
          <Button tipo="submit" text="Cadastrar Observação" />
        </div>
      </FormContainer>
    </>
  );
};

export default AdicionarObservacao;
