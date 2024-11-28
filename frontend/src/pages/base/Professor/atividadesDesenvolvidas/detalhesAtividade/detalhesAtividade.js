import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import atividadeService from '../../../../../services/atividadeService';
import FormContainer from '../../../../../components/FormContainer/FormContainer';
import Button from '../../../../../components/Button/Button';
import './detalhesAtividade.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetalhesAtividade = () => {
    const { pedTipo, pedId, atividadeId } = useParams();
    const [atividade, setAtividade] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showModalDeletar, setShowModalDeletar] = useState(false);
    const [atividadeIdDeletar, setAtividadeIdDeletar] = useState(null);

    useEffect(() => {
        const fetchAtividade = async () => {
            if (!atividadeId) {
              setError('Erro ao carregar os detalhes da atividade: AtividadeId não foi fornecido.');
              return;
            }
          
            try {
              const response = await atividadeService.buscarAtividade(pedTipo, pedId, atividadeId);  // Chama o serviço
              setAtividade(response);  // Atualiza o estado com os dados da atividade
            } catch (err) {
              setError('Erro ao carregar os detalhes da atividade: ' + err.message);
            } finally {
              setLoading(false);
            }
          };

        fetchAtividade();
    }, [pedTipo, atividadeId]);  // Recarrega a atividade quando o pedTipo ou atividadeId mudar

    if (loading) return <div>Carregando...</div>;

    if (error) return <div>{error}</div>;

const handleEditar = () => {
  const usuarioId = jwtDecode(sessionStorage.getItem('token')).idUsuario;
 navigate(`/sessao/Professor/${usuarioId}/atividades/${pedTipo}/${pedId}/editarAtividade/${atividadeId}`);
};


const handleDeletarAtividade = async () => {
  setShowModalDeletar(true);
  setAtividadeIdDeletar(atividade.id);
};

const handleConfirmarDeletar = async () => {
  try {
    await atividadeService.deletarAtividade(pedTipo, pedId, atividadeIdDeletar);
    toast.success("Atividade deletada com sucesso!");
    const usuarioId = jwtDecode(sessionStorage.getItem('token')).idUsuario;
    navigate(`/sessao/Professor/${usuarioId}/atividades/${pedTipo}/${pedId}`); // Redirecionar para a página anterior
  } catch (error) {
    console.error("Erro ao deletar atividade:", error);
    toast.error("Erro ao deletar atividade!");
  } finally {
    setShowModalDeletar(false);
  }
};

const closeModal = () => {
  setShowModalDeletar(false);
};

    return (
        <FormContainer comprimento="70%" titulo={"Detalhes da Atividade"}>
                <p className='detalhe-atividade'><strong>Título:</strong> {atividade?.titulo || 'Título não disponível'}</p>
                <p className='detalhe-atividade'><strong>Criada em:</strong> {atividade?.data_criacao || '-'}</p>
                <p className='detalhe-atividade'><strong>Descrição:</strong> {atividade?.descricao || 'Descrição não disponível'}</p>
                <p className='detalhe-atividade'><strong>Data de Entrega:</strong> {atividade?.data_de_entrega || '-'}</p>
                <p className='detalhe-atividade'><strong>Nota:</strong> {atividade?.nota || 'Não atribuída'}</p>
                <p className='detalhe-atividade'><strong>Observações:</strong> {atividade?.observacoes || 'Observação não disponível'}</p>
                <Button tipo="button" text="Editar Atividade" onClick={handleEditar} />
                <Button tipo="button" text="Deletar Atividade" color="#B80000" onClick={handleDeletarAtividade} />
      <div className='modal-atividades'>
        {showModalDeletar && (
          <div className="modal">
            <p>Tem certeza de que deseja deletar a atividade?</p>
            <Button text="Confirmar" onClick={handleConfirmarDeletar} />
            <Button text="Cancelar" onClick={closeModal} />
          </div>
        )}
      </div>
    </FormContainer>
  );
};

export default DetalhesAtividade;