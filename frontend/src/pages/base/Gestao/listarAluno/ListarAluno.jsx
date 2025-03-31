import React, { useState, useEffect } from 'react';
import styles from './ListarAluno.module.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import 'react-toastify/dist/ReactToastify.css';
import Tabela from '../../../../components/Tabela/Tabela';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import IconeAdicionar from "../../../../assets/icone-adicionar-usuario.png";
import LoadingIFRS from '../../../../components/LoadingIFRS/LoadingIFRS';
import loading from '../../../../assets/loading-usuarios.png'
import { UsuarioService } from '../../../../services/usuarioService';
import BarraPesquisa from '../../../../components/BarraPesquisa/BarraPesquisa';
import Loading from '../../../../components/Loading/Loading';

const ListarAluno = () => {
  const [carregando, setCarregando] = useState(true)
  const [alunos, setAlunos] = useState([]);
  const [pagina, setPagina] = useState(1)
  const [proximaPagina, setProximaPagina] = useState(null)
  const [filtroGeral, setFiltroGeral] = useState('')

  const navigate = useNavigate();

  const fetchAlunos = async () => {
    try {
      const res = await UsuarioService.listarPorGrupo('Alunos', filtroGeral, pagina)

      setAlunos(res.data.results)
      setProximaPagina(res.data.next)
    } catch (error) {
      console.error(error.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    fetchAlunos();
  }, [pagina]);

  return (
    <>
      <FormContainer titulo='Lista de Alunos' comprimento='90%'>
        <div className={styles.container}>
          <BarraPesquisa setFiltro={setFiltroGeral} fetchDados={fetchAlunos} filtro={filtroGeral} />
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
              <Tabela listaFiltrada={alunos} editar={true} visualizar={true} setPagina={setPagina} proximaPagina={proximaPagina} />
            )
          }
        </div>
      </FormContainer>
    </>
  );
};

export default ListarAluno;
