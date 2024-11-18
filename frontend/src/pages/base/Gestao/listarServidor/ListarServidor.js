import React, { useState, useEffect } from 'react';
import './ListarServidor.css';
import FormContainer from '../../../../components/FormContainer/FormContainer'
import Button from "../../../../components/Button/Button";
import Input from '../../../../components/Input/Input';
import 'react-toastify/dist/ReactToastify.css';
import servidorService from '../../../../services/servidorService';
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import { usuarioBaseService } from '../../../../services/usuarioBaseService';
import Tabela from '../../../../components/Tabela/Tabela';

const ListarServidor = () => {
  const [servidores, setServidores] = useState([]);
  const [servidoresFiltrados, setServidoresFiltrados] = useState([]);
  const [grupos, setGrupos] = useState([])
  const [ordenacao, setOrdenacao] = useState({ coluna: '', ordem: 'asc' });
  const [grupoFiltro, setGrupoFiltro] = useState('');
  const [filtroGeral, setFiltroGeral] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [isActiveFiltro, setIsActiveFiltro] = useState('');
  const [matriculaFiltro, setMatriculaFiltro] = useState('');
  
  const navigate = useNavigate();

  const handleClick = (servidor) => {
    navigate(`${servidor.id}/detalhesServidor`, { state: { servidor }});
  };

  const fetchServidores = async () => {
    try {
      const response = await servidorService.listar()

      setServidores(response.data);
      setServidoresFiltrados(response.data)
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

    fetchServidores();
  };

  const filtrarServidores = () => {
      const servidoresFiltrados = servidores.filter(servidor => 
        (!filtroGeral || 
          (servidor.nome && servidor.nome.toLowerCase().includes(filtroGeral.toLowerCase())) ||
          (servidor.matricula && servidor.matricula.includes(filtroGeral)) ||
          (servidor.cpf && servidor.cpf.includes(filtroGeral)) ||
          (servidor.email && servidor.email.includes(filtroGeral))
        ) &&
        (!dataInicio || new Date(servidor.data_ingresso) >= new Date(dataInicio)) &&
        (!dataFim || new Date(servidor.data_ingresso) <= new Date(dataFim)) &&
        (!grupoFiltro || servidor.grupo === grupoFiltro) &&
        (!matriculaFiltro || (servidor.matricula && servidor.matricula.includes(matriculaFiltro))) &&
        (!isActiveFiltro || (servidor.is_active && servidor.is_active.includes(isActiveFiltro)))
      );
      setServidoresFiltrados(servidoresFiltrados);
  };

  useEffect(() => {
    fetchServidores();
    fetchGrupos()
  }, []);

return (
  <>
    <FormContainer titulo='Lista de Servidores' comprimento='90%'>
      <section className='sectionListarServidor'>
        <div className='divListarServidor'>
          <span className="spanListarServidor">
            <label className='labelListarServidor'>Filtrar por Dados Pessoais</label>
            <Input 
              tipo='text'
              valor={filtroGeral}
              onChange={(e) => setFiltroGeral(e.target.value)}/>
          </span>
          <span className="spanListarServidor">
            <label className='labelListarServidor'>Filtrar por Grupo</label>
            <select
              className='selectListarServidor'
              value={grupoFiltro}
              onChange={(e) => setGrupoFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              {
                grupos.map((grupo) => (
                  <option value={grupo.name}>{grupo.name}</option>
                ))
              }
            </select>
          </span>
        </div>
        <div className='divListarServidor'>
          <span className="spanFiltroPeriodo">
            <label className='labelFiltroPeriodo'>Buscar por período de ingresso</label>
            <span className='spanData'>
              <label className='labelData'>Início</label>
              <Input
                valor={dataInicio}
                tipo='date'
                onChange={(e) => {setDataInicio(e.target.value)}}
              />
            </span>
            <span className='spanData'>
              <label className='labelData'>Fim</label>
              <Input
                valor={dataFim}
                tipo='date'
                onChange={(e) => {setDataFim(e.target.value)}}
              />
            </span>
          </span>
        </div>
      </section>
      <span className="spanListarServidor">
        <Button
          text="Buscar"
          onClick={filtrarServidores}
        />
        <Button
          text="Limpar campos"
          onClick={limparBusca}
          color="#4A4A4A"
        />
        <Link to={`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroServidor`}>
          <Button 
            text='Adicionar novo'
          />
        </Link>
    </span>
    <div className='tabelaContainerListarServidor'>
      {/* <table className='tabelaListarServidor'>
        <thead className='cabecalhoListarServidor'>
          <tr className='linhaListarServidor'>
            <th onClick={() => ordenarPorColuna('grupo')}>
                <img
                  className="icone-ordenar"
                  src={Ordenar}
                  alt="Ordenar"
                  style={{ cursor: 'pointer', marginLeft: '8px' }}
                  title="Ordenar"
                  />
                  <p>Grupo</p>
                {ordenacao.coluna === 'grupo' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
                )}
            </th>
            <th onClick={() => ordenarPorColuna('nome')}>
              Nome
              {ordenacao.coluna === 'nome' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('cpf')}>
              CPF
              {ordenacao.coluna === 'cpf' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('matricula')}>
              Matrícula
              {ordenacao.coluna === 'matricula' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('email')}>
              Email
              {ordenacao.coluna === 'email' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('data_ingresso')}>
              Data de Ingresso
              {ordenacao.coluna === 'data_ingresso' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('is_active')}>
              Status
              {ordenacao.coluna === 'is_active' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>

            <th></th>
          </tr>
        </thead>
        <tbody>
          {servidoresFiltrados.map((servidor) => (
            <tr key={`${servidor.id}-${servidor.nome}`}>
              <td>{servidor?.grupo || '-'}</td>
              <td>{servidor.nome || '-'}</td>
              <td>{servidor.cpf || '-'}</td>
              <td>{servidor.matricula || '-'}</td>
              <td>{servidor.email || '-'}</td>
              <td>{servidor.data_ingresso || '-'}</td>
              <td>{servidor.is_active === true ? 'Ativo' : 'Inativo'}</td>
              <td className='icone-container'>
              <img 
                className='iconeAcoes'
                src={Lupa} 
                alt="Visualizar" 
                onClick={() => handleClick(servidor)}
                title="Visualizar"/>
            </td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <Tabela listaFiltrada={servidoresFiltrados}/>
    </div>
    </FormContainer>
  </>
);

};

export default ListarServidor;
