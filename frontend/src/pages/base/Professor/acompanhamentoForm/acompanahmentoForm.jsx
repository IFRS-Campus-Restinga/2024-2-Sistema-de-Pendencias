import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Button from '../../../../components/Button/Button';
import { observacaoService } from '../../../../services/observacaoService';
import './adicionarObservacao.css';

const AdicionarObservacao = () => {
  const { idUsuario, idObservacao } = useParams();
  const navigate = useNavigate();
  const { pedTipo, pedId } = useParams();

  const [formData, setFormData] = useState({
    parecer: '',
    status: '',
  });

  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [dataInsercao, setDataInsercao] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    if (idObservacao) {
      setModoEdicao(true);
      fetchObservacao();
    }
  }, [idObservacao]);

  const fetchObservacao = async () => {
    try {
      const response = await observacaoService.visualizar(idObservacao);
      if (response) {
        setFormData({
          parecer: response.parecer,
          status: response.status,
        });
        setDataInsercao(response.data_insercao);
      }
    } catch (error) {
      console.error('Erro ao buscar observação:', error);
    }
  };

  const validarFormulario = (data) => {
    const errors = {};
    if (!data.parecer) errors.parecer = 'O parecer é obrigatório';
    if (!data.status) errors.status = 'O status é obrigatório';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validarFormulario(formData);
    if (Object.keys(validationErrors).length === 0) {
      setShowErrorMessage(false);

      if (modoEdicao) {
        try {
          const response = await observacaoService.editar(idObservacao, formData);
          if (response) {
            toast.success('Observação editada com sucesso!', {
              position: 'bottom-center',
              autoClose: 3000,
              style: { backgroundColor: '#28A745', color: '#fff' },
              progressStyle: { backgroundColor: '#fff' },
            });
            // Redirecionar para a lista de observações após a edição
            navigate(`/sessao/Professor/${idUsuario}/observacoes/${pedTipo}/${pedId}`);
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
        try {
          const response = await observacaoService.adicionarObservacao(formData);
          if (response) {
            toast.success('Observação cadastrada com sucesso!', {
              position: 'bottom-center',
              autoClose: 3000,
              style: { backgroundColor: '#28A745', color: '#fff' },
              progressStyle: { backgroundColor: '#fff' },
            });
            // Redirecionar para a lista de observações após o cadastro
            navigate(`/sessao/Professor/${idUsuario}/observacoes/${pedTipo}/${pedId}`);
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
      }
    } else {
      setErrors(validationErrors);
      setShowErrorMessage(true);
    }
  };

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
      <FormContainer onSubmit={handleSubmit} titulo={modoEdicao ? "Editar Observação" : "Adicionar Observação"}>
        {showErrorMessage && <p style={{ color: 'red' }}>* Preencha os campos obrigatórios</p>}

        {/* Seção do Parecer */}
        <section className="sectionCadastroObservacao">
          <div className="divCadastroObservacao textarea">
            <label className="labelCadastroObservacao">
              Parecer *
              <textarea
                name="parecer"
                className={errors.parecer ? 'errorTextAreaCadastroObservacao' : 'textAreaCadastroObservacao'}
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
          <Button tipo="submit" text={modoEdicao ? "Editar Observação" : "Cadastrar Observação"} />
        </div>
      </FormContainer>
    </>
  );
};

export default AdicionarObservacao;
