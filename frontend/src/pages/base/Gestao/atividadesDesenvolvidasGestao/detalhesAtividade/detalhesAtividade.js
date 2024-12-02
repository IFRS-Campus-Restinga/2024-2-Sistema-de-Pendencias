import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import atividadeService from '../../../../../services/atividadeService';
import FormContainer from '../../../../../components/FormContainer/FormContainer';
import Button from '../../../../../components/Button/Button';
import './detalhesAtividade.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetalhesAtividadeGestao = () => {
    const { pedTipo, pedId, atividadeId } = useParams();
    const [atividade, setAtividade] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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


    return (
        <FormContainer comprimento="70%" titulo={"Detalhes da Atividade"}>
                <p className='detalhe-atividade'><strong>Título:</strong> {atividade?.titulo || 'Título não disponível'}</p>
                <p className='detalhe-atividade'><strong>Criada em:</strong> {atividade?.data_criacao || '-'}</p>
                <p className='detalhe-atividade'><strong>Descrição:</strong> {atividade?.descricao || 'Descrição não disponível'}</p>
                <p className='detalhe-atividade'><strong>Data de Entrega:</strong> {atividade?.data_de_entrega || '-'}</p>
                <p className='detalhe-atividade'><strong>Nota:</strong> {atividade?.nota || 'Não atribuída'}</p>
                <p className='detalhe-atividade'><strong>Observações:</strong> {atividade?.observacoes || 'Observação não disponível'}</p>
        </FormContainer>
  );
};

export default DetalhesAtividadeGestao;