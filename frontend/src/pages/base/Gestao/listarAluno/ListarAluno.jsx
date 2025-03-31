import React, { useState, useEffect } from 'react';
import styles from './ListarAluno.module.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import 'react-toastify/dist/ReactToastify.css';
import Tabela from '../../../../components/Tabela/Tabela';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import IconeAdicionar from "../../../../assets/icone-adicionar-usuario.png";
import { UsuarioService } from '../../../../services/usuarioService';
import BarraPesquisa from '../../../../components/BarraPesquisa/BarraPesquisa';
import Loading from '../../../../components/Loading/Loading';

const ListarAluno = () => {
  const [carregando, setCarregando] = useState(true);
  const [carregandoTabela, setCarregandoTabela] = useState(false)
  const [alunos, setAlunos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [proximaURL, setProximaURL] = useState(null)
  const [filtroGeral, setFiltroGeral] = useState('');
  const navigate = useNavigate();

  const fetchAlunosPagina = async () => {
    setCarregandoTabela(true)
    try {
      const res = await UsuarioService.listarPorGrupo('alunos', filtroGeral, pagina);

      setAlunos((prev) => [...prev, ...res.data.results])

      setProximaURL(res.data.next)
    } catch (error) {
      console.error(error.mensagem);
    } finally {
      setCarregando(false);
      setCarregandoTabela(false)
    }
  };

  const fetchAlunosFiltro = async () => {
    setCarregandoTabela(true)
    try {
      const res = await UsuarioService.listarPorGrupo('alunos', filtroGeral, pagina);

      setAlunos(res.data.results)

      setProximaURL(res.data.next)
    } catch (error) {
      console.error(error.mensagem);
    } finally {
      setCarregando(false);
      setCarregandoTabela(false)
    }
  }

  useEffect(() => {
    if (proximaURL) fetchAlunosPagina();
  }, [pagina]);

  useEffect(() => {
    if (filtroGeral === '') fetchAlunosFiltro();
  }, [filtroGeral]);

  return (
    <>
      <FormContainer titulo='Lista de Alunos' comprimento='90%'>
        <div className={styles.container}>
          <BarraPesquisa setFiltro={setFiltroGeral} fetchDados={fetchAlunosFiltro} filtro={filtroGeral} />
          <div>
            <img
              className={styles.iconeAdicionarAluno}
              src={IconeAdicionar}
              onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroAluno`)}
              title='Cadastrar Aluno'
            />
          </div>
        </div>
        <div className={styles.containerTabela}>
          {
            carregando ? (
              <Loading border={'green'} />
            ) : (
              <Tabela
                listaFiltrada={alunos}
                editar={true}
                visualizar={false}
                setPagina={setPagina}
                proximaURL={proximaURL}
                carregando={carregandoTabela}
              />
            )
          }
        </div>
      </FormContainer>
    </>
  );
};

export default ListarAluno;
