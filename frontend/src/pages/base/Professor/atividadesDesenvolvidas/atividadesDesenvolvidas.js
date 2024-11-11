import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './atividadesDesenvolvidas.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Button from '../../../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lupa from "../../../../assets/lupa.png";
import atividadeService from '../../../../services/atividadeService';

const AtividadesDesenvolvidas = () => {
  const [atividades, setAtividades] = useState([]);
  const [aluno, setAluno] = useState(null); // Pode ser removido se você não precisar mais dessa variável
  const [notaFinal, setNotaFinal] = useState(null);
  const [situacao, setSituacao] = useState('');
  const [loading, setLoading] = useState(true);

  const { pedTipo, pedId } = useParams(); // idUsuario não está sendo usado no código, então removi

  const navigate = useNavigate();

  // Função para buscar as atividades
  const fetchAtividades = async () => {
    try {
      if (!pedTipo || !pedId) {
        console.error('pedTipo ou pedId não encontrado');
        toast.error('Erro ao carregar atividades');
        return;
      }
      const response = await atividadeService.listarAtividades(pedTipo, pedId);
      setAtividades(response.data);
      calcularNotaFinal(response.data);

      // Se o aluno não estiver presente nas atividades, você pode usar o primeiro aluno da resposta
      if (response.data.length > 0 && response.data[0].aluno) {
        setAluno(response.data[0].aluno); // Definindo aluno a partir da primeira atividade
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error.response || error);
      toast.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  // Função para calcular a nota final do aluno
  const calcularNotaFinal = (atividades) => {
    const totalNotas = atividades.reduce((acc, atividade) => acc + (atividade.nota || 0), 0);
    const notaMedia = totalNotas / atividades.length;
    setNotaFinal(notaMedia);
    setSituacao(notaMedia >= 7 ? 'Aprovado' : 'Reprovado');
  };

  // Carregar atividades e dados do aluno ao montar o componente
  useEffect(() => {
    fetchAtividades();
  }, [pedTipo, pedId]); 

  // Função para navegação para adicionar nova atividade
  const handleAdicionarAtividade = () => {
    navigate(`/professor/atividades/${pedTipo}/${pedId}/adicionar`);
  };

  // Função para navegar para a visualização da atividade
  const handleVisualizarAtividade = (atividadeId) => {
    navigate(`/professor/atividades/${atividadeId}/detalhes`);
  };

  return (
    <>
      <ToastContainer />
      <FormContainer titulo="Atividades Desenvolvidas" comprimento="90%">
      <div className="info-e-botao">
        <div className="info-aluno">
          {aluno && <p><strong>Aluno:</strong> {aluno.nome}</p>}
        </div>
        <Button text="Adicionar Atividade" onClick={handleAdicionarAtividade} />
      </div>
        <div className="tabela-atividades">
          <table>
            <thead>
              <tr>
                <th>Criado em</th>
                <th>Atividade</th>
                <th>Data de entrega</th>
                <th>Nota</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5">Carregando...</td></tr>
              ) : (
                atividades.map((atividade) => (
                  <tr key={atividade.id}>
                    <td>{new Date(atividade.data_criacao).toLocaleDateString()}</td>
                    <td>{atividade.titulo}</td>
                    <td>{new Date(atividade.data_de_entrega).toLocaleDateString()}</td>
                    <td>{atividade.nota || 'Não atribuída'}</td>
                    <td className="icone-container">
                      <img 
                        className="iconeAcoes"
                        src={Lupa} 
                        alt="Visualizar"
                        onClick={() => handleVisualizarAtividade(atividade.id)}
                        title="Visualizar"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="nota-final">
          <p><strong>Nota Final:</strong> {notaFinal !== null ? notaFinal.toFixed(2) : 'Não disponível'}</p>
          <p><strong>Situação:</strong> {situacao}</p>
        </div>
      </FormContainer>
    </>
  );
};

export default AtividadesDesenvolvidas;
