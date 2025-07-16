import { useState, useEffect } from 'react';
import styles from './ListarDependencias.module.css';
import FormContainer from '../../components/FormContainer/FormContainer';
import 'react-toastify/dist/ReactToastify.css';
import Tabela from '../../components/Tabela/Tabelas/Tabela';
import { useLocation, useNavigate } from 'react-router-dom';
import IconeAdicionar from "../../assets/icone-adicionar-disciplina.png";
import BarraPesquisa from '../../components/BarraPesquisa/BarraPesquisa';
import Loading from '../../components/Loading/Loading';
import { PEDService } from '../../services/pedService';
import { PPTService } from '../../services/pptService';

const ListarCurso = () => {
  const location = useLocation()
  const tipo = location.pathname.split('/')[2]
  const modalidade = location.pathname.split('/')[3]
  const [carregando, setCarregando] = useState(true);
  const [carregandoTabela, setCarregandoTabela] = useState(false)
  const [Progressoes, setProgressoes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [proximaURL, setProximaURL] = useState(null)
  const [filtroGeral, setFiltroGeral] = useState('');
  const navigate = useNavigate();

  const fetchProgressoesPagina = async () => {
    setCarregandoTabela(true)

    try {
      let req

      if (tipo == 'peds') req = PEDService.listar('lista', filtroGeral, pagina, modalidade);

      if (tipo == 'ppts') req = PPTService.listar('lista', filtroGeral, pagina)

      const res = await req

      setProgressoes((prev) => [...prev, ...res.data.results])

      setProximaURL(res.data.next)
    } catch (error) {
      console.error(error.mensagem);
    } finally {
      setCarregando(false);
      setCarregandoTabela(false)
    }
  };

  const fetchProgressoesFiltro = async () => {
    setCarregandoTabela(true)

    try {
      let req

      if (tipo == 'peds') req = PEDService.listar('lista', filtroGeral, pagina, modalidade);

      if (tipo == 'ppts') req = PPTService.listar('lista', filtroGeral, pagina)

      const res = await req

      setProgressoes(res.data.results)

      setProximaURL(res.data.next)
    } catch (error) {
      console.error(error.mensagem);
    } finally {
      setCarregando(false);
      setCarregandoTabela(false)
    }
  }

  useEffect(() => {
    if (proximaURL) fetchProgressoesPagina();
  }, [pagina, modalidade]);

  useEffect(() => {
    if (filtroGeral === '') fetchProgressoesFiltro();
    console.log(filtroGeral)
  }, [filtroGeral, modalidade]);

  return (
    <>
      <FormContainer titulo={tipo === 'peds' ? `Lista de PEDs ${modalidade}` : 'Lista de PPTs'} comprimento='90%'>
        <div className={styles.container}>
          <BarraPesquisa setFiltro={setFiltroGeral} fetchDados={fetchProgressoesFiltro} filtro={filtroGeral} setPagina={setPagina} />
          <div>
            <img
              className={styles.iconeAdicionarProgressao}
              src={IconeAdicionar}
              onClick={() => navigate(tipo === 'peds' ? '/Gestão Escolar/cadastroPED/' : '/Gestão Escolar/cadastroPPT/')}
              title='Cadastrar Progressão'
            />
          </div>
        </div>
        <div className={styles.containerTabela}>
          {
            carregando ? (
              <Loading border={'green'} />
            ) : (
              <Tabela
                listaFiltrada={Progressoes}
                editar={true}
                visualizar={true}
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
