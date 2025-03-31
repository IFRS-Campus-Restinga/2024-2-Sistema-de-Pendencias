import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsuarioService } from "../../../../services/usuarioService";
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
  const [proximaURL, setProximaURL] = useState(null)
  const [filtroGeral, setFiltroGeral] = useState('');
  const navigate = useNavigate();

  const fetchServidoresPagina = async () => {
    setCarregandoTabela(true)
    try {
      const res = await UsuarioService.listarPorGrupo('servidores', filtroGeral, pagina);

      setServidores((prev) => [...prev, ...res.data.results])

      setProximaURL(res.data.next)
    } catch (error) {
      console.error(error.mensagem);
    } finally {
      setCarregando(false);
      setCarregandoTabela(false)
    }
  };

  const fetchServidoresFiltro = async () => {
    setCarregandoTabela(true)
    try {
      const res = await UsuarioService.listarPorGrupo('servidores', filtroGeral, pagina);

      setServidores(res.data.results)

      setProximaURL(res.data.next)
    } catch (error) {
      console.error(error.mensagem);
    } finally {
      setCarregando(false);
      setCarregandoTabela(false)
    }
  }

  useEffect(() => {
    if (proximaURL) fetchServidoresPagina();
  }, [pagina]);

  useEffect(() => {
    if (filtroGeral === '') fetchServidoresFiltro();
  }, [filtroGeral]);

  return (
    <FormContainer titulo="Lista de Servidores" comprimento="90%">
      <div className={styles.container}>
        <BarraPesquisa setFiltro={setFiltroGeral} fetchDados={fetchServidoresFiltro} filtro={filtroGeral} setPagina={setPagina} />
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
              visualizar={false}
              setPagina={setPagina}
              proximaURL={proximaURL}
              carregando={carregandoTabela}
            />
          )
        }
      </div>
    </FormContainer>
  );
};

export default ListarServidor
