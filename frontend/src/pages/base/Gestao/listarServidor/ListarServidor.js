import React, { useState, useEffect } from 'react';
import './ListarServidor.css';
import FormContainer from '../../../../components/FormContainer/FormContainer'
import Input from '../../../../components/Input/Input';
import 'react-toastify/dist/ReactToastify.css';
import servidorService from '../../../../services/servidorService';
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import { usuarioBaseService } from '../../../../services/usuarioBaseService';
import Tabela from '../../../../components/Tabela/Tabela';
import IconeAdicionar from "../../../../assets/icone-adicionar-usuario.png";
import X from "../../../../assets/x-branco.png";
import Lupa from "../../../../assets/lupa-branca.png";
import loading from '../../../../assets/loading-usuarios.png'
import LoadingIFRS from '../../../../components/LoadingIFRS/LoadingIFRS';


const ListarServidor = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [servidores, setServidores] = useState([]);
  const [servidoresFiltrados, setServidoresFiltrados] = useState([]);
  const [grupos, setGrupos] = useState([])
  const [grupoFiltro, setGrupoFiltro] = useState('');
  const [filtroGeral, setFiltroGeral] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [isActiveFiltro, setIsActiveFiltro] = useState('');
  const [matriculaFiltro, setMatriculaFiltro] = useState('');
  const navigate = useNavigate();

  const fetchServidores = async () => {
    try {
      const response = await servidorService.listar()

      setServidores(response.data);
      setServidoresFiltrados(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Erro ao buscar servidores:', error);
    }
  };

  const fetchGrupos = async () => {
    try {
      const res = await usuarioBaseService.listarGrupos()

      if (res.status !== 200) throw new Error(res)

      const grupos = res.data.filter((grupo) => grupo.name !== 'Aluno')

      setGrupos(grupos)
    } catch (error) {
      console.error('Erro ao buscar grupos: ', error)
    }
  }

  const limparBusca = () => {
    setDataInicio('');
    setDataFim('');
    setFiltroGeral('');
    setGrupoFiltro('');
    setMatriculaFiltro('');
    setIsActiveFiltro('');
    fetchServidores();
  };

  const removeAcentos = (str) => 
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

  const filtrarServidores = () => {
    const servidoresFiltrados = servidores.filter((servidor) => {
      const filtroGeralAtende = !filtroGeral ||
        Object.values(servidor).some((campo) =>
          removeAcentos(campo?.toString().toLowerCase()).includes(
            removeAcentos(filtroGeral.toLowerCase())
          )
        );
  
      return (
        filtroGeralAtende &&
        (!dataInicio || new Date(servidor.data_ingresso) >= new Date(dataInicio)) &&
        (!dataFim || new Date(servidor.data_ingresso) <= new Date(dataFim)) &&
        (!grupoFiltro || removeAcentos(servidor.grupo).toLowerCase() === removeAcentos(grupoFiltro).toLowerCase()) &&
        (!matriculaFiltro || (servidor.matricula && servidor.matricula.includes(matriculaFiltro))) &&
        (!isActiveFiltro || (servidor.is_active && servidor.is_active.includes(isActiveFiltro)))
      );
    });
  
    setServidoresFiltrados(servidoresFiltrados);
  };

  useEffect(() => {
    fetchServidores();
    fetchGrupos()
  }, []);

  if (isLoading) return <LoadingIFRS icone={loading}/>

  return (
    <>
      <FormContainer titulo='Lista de Servidores' comprimento='90%'
      onSubmit={(e) => {
        e.preventDefault();
        filtrarServidores();
      }}>
        <div className='containerBuscarServidor'>
          <div class="buscaBarServidor">
            <Input
              tipo='search'
              valor={filtroGeral}
              onChange={(e) => setFiltroGeral(e.target.value)}
              textoAjuda={'Buscar por nome, e-mail, grupo, status...'}
            />
            <img
              className='iconesBuscarServidor'
              src={Lupa}
              onClick={filtrarServidores}
              title='Buscar'
            />
            <img
              className='iconesBuscarServidor'
              src={X}
              onClick={limparBusca}
              title='Limpar Busca'
            />
          </div>
          <div className='adicionarServidor'>
            <img
              className='iconeAdicionarServidor'
              src={IconeAdicionar}
              onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroServidor`)}
              title='Cadastrar Servidor'
            />
          </div>
        </div>

        <div className='tabelaContainerListarServidor'>
          <Tabela listaFiltrada={servidoresFiltrados} editar={true} visualizar={true}/>
        </div>
      </FormContainer>
    </>
  );

};

export default ListarServidor;
