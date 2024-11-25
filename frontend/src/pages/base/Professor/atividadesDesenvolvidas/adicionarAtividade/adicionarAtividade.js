import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Para capturar parâmetros da URL e navegar
import atividadeService from '../../../../../services/atividadeService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormContainer from '../../../../../components/FormContainer/FormContainer';
import Button from '../../../../../components/Button/Button';
import Input from '../../../../../components/Input/Input';
import './adicionarAtividade.css';

const AdicionarAtividade = () => {
  const { usuarioId, pedTipo, pedId, atividadeId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_de_entrega: '',
    nota: '',
    observacoes: ''
  });

  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Função de validação de formulário
  const validarFormulario = (data) => {
    const errors = {};
    if (!data.titulo) errors.titulo = 'O título é obrigatório';
    if (!data.descricao) errors.descricao = 'A descrição é obrigatória';
    if (!data.data_de_entrega) errors.data_de_entrega = 'A data de entrega é obrigatória';
    return errors;
  };

  // Função para buscar dados de uma atividade para edição
  const buscarAtividade = async () => {
    try {
      const response = await atividadeService.buscarAtividade(pedTipo, pedId, atividadeId);
      if (response) {
        setFormData({
          titulo: response.titulo,
          descricao: response.descricao,
          data_de_entrega: response.data_de_entrega,
          nota: response.nota || '',
          observacoes: response.observacoes
        });
      } else {
        toast.error('Atividade não encontrada', {
          position: 'bottom-center',
          autoClose: 3000,
          style: { backgroundColor: '#d11c28', color: '#fff' },
          progressStyle: { backgroundColor: '#fff' }
        });
      }
    } catch (error) {
      console.error('Erro ao buscar atividade:', error);
      toast.error('Erro ao buscar atividade. Tente novamente.', {
        position: 'bottom-center',
        autoClose: 3000,
        style: { backgroundColor: '#d11c28', color: '#fff' },
        progressStyle: { backgroundColor: '#fff' }
      });
    }
  };

  // UseEffect para buscar dados da atividade quando o componente for carregado
  useEffect(() => {
    if (atividadeId) {
      buscarAtividade();
    }
  }, [atividadeId]);

  // Função de envio do formulário (para edição ou criação)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submetendo formulário...');
  
    // Garantir que a nota seja 0 se não for informada
    const dadosComNotaDefault = {
      ...formData,
      nota: formData.nota === '' ? 0 : formData.nota,  // Se a nota estiver vazia, define como 0
    };
  
    const validationErrors = validarFormulario(dadosComNotaDefault);
    console.log('Erros de validação:', validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      setShowErrorMessage(false);
      try {
        let response;
        if (atividadeId) {
          response = await atividadeService.editarAtividade(pedTipo, pedId, atividadeId, dadosComNotaDefault);
        } else {
          response = await atividadeService.adicionarAtividade(pedTipo, pedId, dadosComNotaDefault);
        }
  
        if (response.id) {
          toast.success(atividadeId ? 'Atividade atualizada com sucesso!' : 'Atividade cadastrada com sucesso!', {
            position: 'bottom-center',
            autoClose: 3000,
            style: { backgroundColor: '#28A745', color: '#fff' },
            progressStyle: { backgroundColor: '#fff' }
          });
  
          // Redirecionar após o sucesso da operação
          navigate(`/sessao/Professor/${usuarioId}/atividades/${pedTipo}/${pedId}/`);
        } else {
          toast.error('Falha ao salvar a atividade. Tente novamente.', {
            position: 'bottom-center',
            autoClose: 3000,
            style: { backgroundColor: '#d11c28', color: '#fff' },
            progressStyle: { backgroundColor: '#fff' }
          });
        }
      } catch (error) {
        console.error('Erro ao salvar atividade:', error);
        toast.error('Falha ao salvar atividade. Tente novamente.', {
          position: 'bottom-center',
          autoClose: 3000,
          style: { backgroundColor: '#d11c28', color: '#fff' },
          progressStyle: { backgroundColor: '#fff' }
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

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo={atividadeId ? 'Editar Atividade' : 'Adicionar Atividade'} comprimento="60%">
        {showErrorMessage && <p style={{ color: 'red' }}>* Preencha os campos obrigatórios</p>}

        {/* Campo Título */}
        <div className="form-group">
          <label htmlFor="titulo" className="labelCadastroAluno">Título</label>
          <Input
            tipo="text"
            valor={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            onBlur={() => handleBlur('titulo')}
            erro={errors.titulo}
          />
          {errors.titulo && <p className="erros">{errors.titulo}</p>}
        </div>

        {/* Campo Descrição */}
        <div className="form-group">
          <label htmlFor="descricao" className="labelCadastroAluno">Descrição</label>
          <Input
            tipo="textarea"
            valor={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            onBlur={() => handleBlur('descricao')}
            erro={errors.descricao}
            multiline
          />
          {errors.descricao && <p className="erros">{errors.descricao}</p>}
        </div>

        {/* Campo Data de Entrega */}
        <div className="form-group">
          <label htmlFor="data_de_entrega" className="labelCadastroAluno">Data de Entrega</label>
          <Input
            type='date'
            valor={formData.data_de_entrega}
            onChange={(e) => setFormData({ ...formData, data_de_entrega: e.target.value })}
            onBlur={() => handleBlur('data_de_entrega')}
            erro={errors.data_de_entrega}
          />
          {errors.data_de_entrega && <p className="erros">{errors.data_de_entrega}</p>}
        </div>

        {/* Campo Nota (apenas na edição) */}
        {atividadeId && (
          <div className="form-group">
            <label htmlFor="nota" className="labelCadastroAluno">Nota</label>
            <Input
              tipo="number"
              valor={formData.nota}
              onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
            />
          </div>
        )}

        {/* Campo Observações (apenas na edição) */}
        {atividadeId && (
          <div className="form-group">
            <label htmlFor="observacoes" className="labelCadastroAluno">Observações</label>
            <Input
              tipo="textarea"
              valor={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              multiline
            />
          </div>
        )}

        <div className="ajuste-button">
          <button type="submit">{atividadeId ? 'Atualizar Atividade' : 'Cadastrar Atividade'}</button>
        </div>
      </FormContainer>
    </>
  );
};

export default AdicionarAtividade;
