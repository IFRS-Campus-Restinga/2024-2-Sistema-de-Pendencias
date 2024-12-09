import React, { useState, useEffect } from "react";
import axios from "axios";
import "./atividadesDesenvolvidas.css";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lupa from "../../../../assets/lupa.png";
import atividadeService from "../../../../services/atividadeService";
import { jwtDecode } from "jwt-decode";


const AtividadesDesenvolvidasGestao = () => {
  const [atividades, setAtividades] = useState([]);
  const [aluno, setAluno] = useState(null);
  const [notaFinal, setNotaFinal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planoAtividades, setPlanoAtividades] = useState(null);
  const { pedTipo, pedId } = useParams();

  const navigate = useNavigate();

  // Função para buscar as atividades
  const fetchAtividades = async () => {
    try {
      if (!pedTipo || !pedId) {
        console.error("pedTipo ou pedId não encontrado");
        toast.error("Erro ao carregar atividades");
        return;
      }
      const response = await atividadeService.listarAtividades(pedTipo, pedId);
      setAtividades(response.data);


      if (response.data.length > 0 && response.data[0].aluno) {
        setAluno(response.data[0].aluno); 
      }
    } catch (error) {
      console.error("Erro ao carregar atividades:", error.response || error);
      toast.error("Erro ao carregar atividades");
    } finally {
      setLoading(false);
    }
  };

  const handleAnexarPlanoAtividades = async () => {
    try {
      if (!planoAtividades) {
        toast.error("Selecione um arquivo antes de anexar.");
        return;
      }
      const formData = new FormData();
      formData.append("plano_atividades", planoAtividades);
      console.log(planoAtividades);

      await atividadeService.adicionarPlanoAtividades(pedTipo, pedId, formData);
      toast.success("Plano de atividades anexado com sucesso!");
    } catch (error) {
      console.error("Erro ao anexar plano de atividades:", error);
      toast.error("Erro ao anexar plano de atividades!");
    }
  };

  // Carregar atividades e dados do aluno ao montar o componente
  useEffect(() => {
    const fetchNotaFinal = async () => {
      try {
        const response = await atividadeService.exibirNotaFinal(pedTipo, pedId);
        setNotaFinal(response?.nota_final || null); // Atualiza o estado com a nota final, se existir
      } catch (error) {
        console.error("Erro ao buscar nota final:", error);
        toast.error("Erro ao carregar a nota final.");
      }
    };
  
    fetchAtividades(); // Chama a função existente
    fetchNotaFinal();  // Busca a nota final
  }, [pedTipo, pedId]);


  // Função para navegar para a visualização da atividade
  const handleVisualizarAtividade = (atividadeId) => {
    const usuarioId = jwtDecode(sessionStorage.getItem("token")).idUsuario;
    navigate(
      `/sessao/Gestão Escolar/${usuarioId}/atividades/${pedTipo}/${pedId}/detalhes/${atividadeId}`
    );
  };


  return (
    <>
      <ToastContainer />
      <FormContainer titulo="Atividades Desenvolvidas" comprimento="90%">
        <div className="info-e-botao">
          <div className="info-aluno">
            {aluno && (
              <p>
                <strong>Aluno:</strong> {aluno.nome}
              </p>
            )}
          </div>
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
                <tr>
                  <td colSpan="5">Carregando...</td>
                </tr>
              ) : (
                atividades.map((atividade) => (
                  <tr key={atividade.id}>
                    <td>
                    {atividade?.data_criacao || '-'}
                    </td>
                    <td>{atividade.titulo}</td>
                    <td>
                    {atividade?.data_de_entrega || '-'}
                    </td>
                    <td>{atividade.nota || "Não atribuída"}</td>
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
        <p><strong>Nota Final:</strong></p>
          <p>{notaFinal || "Não definida"}</p>
        </div>
      </FormContainer>
    </>
  );
};

export default AtividadesDesenvolvidasGestao;
