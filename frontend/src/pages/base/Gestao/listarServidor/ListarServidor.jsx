import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsuarioService } from "../../../../services/usuarioService";
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import BarraPesquisa from "../../../../components/BarraPesquisa/BarraPesquisa";
import Tabela from "../../../../components/Tabela/Tabela";
import { jwtDecode } from "jwt-decode";
import styles from './ListarServidor.module.css'
import iconeAdicionar from '../../../../assets/icone-adicionar-usuario.png'
import Loading from "../../../../components/Loading/Loading";

const ListarServidor = () => {
  const [carregando, setCarregando] = useState(true);
  const [carregandoTabela, setCarregandoTabela] = useState(false)
  const [servidores, setServidores] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [proximaPagina, setProximaPagina] = useState(null)
  const [paginaAnterior, setPaginaAnterior] = useState(null)
  const [filtroGeral, setFiltroGeral] = useState('');
  const navigate = useNavigate();

  const fetchServidores = async () => {
    setCarregandoTabela(true)
    try {
      const res = await UsuarioService.listarPorGrupo('servidores', filtroGeral, pagina);

      if (servidores.length < 20) {
        setServidores(prev => prev.concat(res.data.results))
      } else {
        setServidores(res.data.results);
      }

      setProximaPagina(res.data.next)
      setPaginaAnterior(res.data.previous)
    } catch (error) {
      console.error(error.mensagem);
    } finally {
      setCarregando(false);
      setCarregandoTabela(false)
    }
  };

  useEffect(() => {
    if (proximaPagina || paginaAnterior) fetchServidores();

  }, [pagina]);

  useEffect(() => {
    if (filtroGeral === '') fetchServidores();
  }, [filtroGeral]);

  return (
    <FormContainer titulo="Lista de Servidores" comprimento="90%">
      <div className={styles.container}>
        <BarraPesquisa setFiltro={setFiltroGeral} fetchDados={fetchServidores} filtro={filtroGeral} setPagina={setPagina} />
        <div>
          <img
            className={styles.iconeAdicionarServidor}
            src={iconeAdicionar}
            onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroServidor`)}
            title="Cadastrar Servidor"
          />
        </div>
      </div>
      <div className={styles.containerTabela}>
        {
          carregando ? (
            <Loading border={'green'} />
          ) : (
            <Tabela
              listaFiltrada={servidores}
              editar={true}
              visualizar={true}
              setPagina={setPagina}
              proximaPagina={proximaPagina}
              paginaAnterior={paginaAnterior}
              carregando={carregandoTabela}
            />
          )
        }
      </div>
    </FormContainer>
  );
};

export default ListarServidor
