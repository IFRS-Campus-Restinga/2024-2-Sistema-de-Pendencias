import React, { useState, useEffect } from "react";
import axios from "axios";
import "./atividadesDesenvolvidas.css";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lupa from "../../../../assets/lupa.png";
import Deletar from "../../../../assets/deletar-preto.png";
import atividadeService from "../../../../services/atividadeService";
import { jwtDecode } from "jwt-decode";
import Input from "../../../../components/Input/Input";
import Tabela from "../../../../components/Tabela/Tabela";

const AtividadesDesenvolvidas = () => {
  const [atividades, setAtividades] = useState([]);
  const [aluno, setAluno] = useState(null);
  const [notaFinal, setNotaFinal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notaInput, setNotaInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [planoAtividades, setPlanoAtividades] = useState(null);
  const [showModalDeletar, setShowModalDeletar] = useState(false);
  const [atividadeIdDeletar, setAtividadeIdDeletar] = useState(null);
  let [planoUrl, setPlanoUrl] = useState(null);

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

      // Se o aluno não estiver presente nas atividades, você pode usar o primeiro aluno da resposta
      if (response.data.length > 0 && response.data[0].aluno) {
        setAluno(response.data[0].aluno); // Definindo aluno a partir da primeira atividade
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
    fetchAtividades();
  }, [pedTipo, pedId]);

  // Função para navegação para adicionar nova atividade
  const handleAdicionarAtividade = () => {
    const usuarioId = jwtDecode(sessionStorage.getItem("token")).idUsuario;
    navigate(
      `/sessao/Professor/${usuarioId}/atividades/${pedTipo}/${pedId}/adicionarAtividade`
    );
  };

  // Função para navegar para a visualização da atividade
  const handleVisualizarAtividade = (atividadeId) => {
    const usuarioId = jwtDecode(sessionStorage.getItem("token")).idUsuario;
    navigate(
      `/sessao/Professor/${usuarioId}/atividades/${pedTipo}/${pedId}/detalhes/${atividadeId}`
    );
  };

  // Função para deletar uma atividade
  const handleDeletarAtividade = async (atividadeId) => {
    setShowModalDeletar(true);
    setAtividadeIdDeletar(atividadeId);
  };

  const handleConfirmarDeletar = async () => {
    try {
      await atividadeService.deletarAtividade(
        pedTipo,
        pedId,
        atividadeIdDeletar
      );
      toast.success("Atividade deletada com sucesso!");
      fetchAtividades(); // Atualiza a lista de atividades
      setShowModalDeletar(false);
    } catch (error) {
      console.error("Erro ao deletar atividade:", error);
      toast.error("Erro ao deletar atividade!");
      setShowModalDeletar(false);
    }
  };

  const handleNotaInput = (e) => setNotaInput(e.target.value);

  const handleSaveNotaFinal = () => {
    setShowModal(true); // Exibir o modal de confirmação
  };

  const confirmSaveNotaFinal = async () => {
    try {
      const response = await atividadeService.atualizarNotaFinal(
        pedTipo,
        pedId,
        parseFloat(notaInput)
      );
      setNotaFinal(response.data.nota_final); // Atualiza a nota final na tela
      toast.success("Nota final salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar a nota final:", error.response || error);
      toast.error("Erro ao salvar a nota final.");
    } finally {
      setShowModal(false); // Fechar o modal
    }
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
          <Button
            text="Adicionar Atividade"
            onClick={handleAdicionarAtividade}
          />
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
                      {new Date(atividade.data_criacao).toLocaleDateString()}
                    </td>
                    <td>{atividade.titulo}</td>
                    <td>
                      {new Date(atividade.data_de_entrega).toLocaleDateString()}
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
                      <img
                        className="iconeAcoes"
                        src={Deletar}
                        alt="Deletar"
                        onClick={() => handleDeletarAtividade(atividade.id)}
                        title="Deletar"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="modal-atividades">
          {showModalDeletar && (
            <div className="modal">
              <p>Tem certeza de que deseja deletar a atividade?</p>
              <Button text="Confirmar" onClick={handleConfirmarDeletar} />
              <Button
                text="Cancelar"
                onClick={() => setShowModalDeletar(false)}
              />
            </div>
          )}
        </div>
        <div className="plano-atividades">
          <div className="container-botao-anexar">
            <strong>Plano de atividades:</strong>
            <Input
              className="input-arquivo"
              type="file"
              onChange={(e) => setPlanoAtividades(e.target.files[0])}
            />
            <Button text="Anexar" onClick={handleAnexarPlanoAtividades} />
          </div>
        </div>
        <div className="nota-final">
          <p>Nota Final:</p>
          <Input
            type="number"
            value={notaInput}
            onChange={handleNotaInput}
            placeholder="Informe a nota final"
          />
          <Button text="Finalizar" onClick={handleSaveNotaFinal} />
        </div>
        <div className="modal-atividades">
          {showModal && (
            <div className="modal">
              <p>
                Tem certeza de que deseja salvar a nota final e finalizar a PED?
              </p>
              <Button text="Confirmar" onClick={confirmSaveNotaFinal} />
              <Button text="Cancelar" onClick={() => setShowModal(false)} />
            </div>
          )}
        </div>
      </FormContainer>
    </>
  );
};

export default AtividadesDesenvolvidas;
