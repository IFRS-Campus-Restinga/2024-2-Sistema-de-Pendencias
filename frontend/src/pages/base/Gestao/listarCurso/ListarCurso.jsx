import React, { useState, useEffect } from 'react';
import styles from './ListarCurso.module.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import 'react-toastify/dist/ReactToastify.css';
import Tabela from '../../../../components/Tabela/Tabela';
import { useNavigate } from 'react-router-dom';
import IconeAdicionar from "../../../../assets/icone-adicionar-curso.png";
import BarraPesquisa from '../../../../components/BarraPesquisa/BarraPesquisa';
import Loading from '../../../../components/Loading/Loading';
import cursoService from '../../../../services/cursoService';

const ListarCurso = () => {
  const [carregando, setCarregando] = useState(true);
  const [carregandoTabela, setCarregandoTabela] = useState(false)
  const [cursos, setCursos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [proximaURL, setProximaURL] = useState(null)
  const [filtroGeral, setFiltroGeral] = useState('');
  const navigate = useNavigate();

  const fetchCursosPagina = async () => {
    setCarregandoTabela(true)
    try {
      const res = await cursoService.listar('cursos', filtroGeral, pagina);

      setCursos((prev) => [...prev, ...res.data.results])

      setProximaURL(res.data.next)
    } catch (error) {
      console.error(error.mensagem);
    } finally {
      setCarregando(false);
      setCarregandoTabela(false)
    }
  };

  const fetchCursosFiltro = async () => {
    setCarregandoTabela(true)
    try {
      const res = await cursoService.listar('lista', filtroGeral, pagina);

      setCursos(res.data.results)

      setProximaURL(res.data.next)
    } catch (error) {
      console.error(error.mensagem);
    } finally {
      setCarregando(false);
      setCarregandoTabela(false)
    }
  }

  useEffect(() => {
    if (proximaURL) fetchCursosPagina();
  }, [pagina]);

  useEffect(() => {
    if (filtroGeral === '') fetchCursosFiltro();
  }, [filtroGeral]);

  return (
    <>
      <FormContainer titulo='Lista de cursos' comprimento='90%'>
        <div className={styles.container}>
          <BarraPesquisa setFiltro={setFiltroGeral} fetchDados={fetchCursosFiltro} filtro={filtroGeral} setPagina={setPagina} />
          <div>
            <img
              className={styles.iconeAdicionarCurso}
              src={IconeAdicionar}
              onClick={() => navigate(`/Gestão Escolar/cadastroCurso`)}
              title='Cadastrar Curso'
            />
          </div>
        </div>
        <div className={styles.containerTabela}>
          {
            carregando ? (
              <Loading border={'green'} />
            ) : (
              <Tabela
                listaFiltrada={cursos}
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

export default ListarCurso;
