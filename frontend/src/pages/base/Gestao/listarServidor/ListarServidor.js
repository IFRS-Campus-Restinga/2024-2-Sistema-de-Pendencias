import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListarServidor.css';
import Button from "../../../../components/Button/Button";
import FormContainer from '../../../../components/FormContainer/FormContainer'
import Deletar from "../../../../assets/deletar-preto.png";
import Visualizar from "../../../../assets/visualizar-preto.png";
import Ordenar from "../../../../assets/ordenar-branco.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import servidorService from '../../../../services/servidorService';
import Input from '../../../../components/Input/Input';

const ListarServidor = () => {
  const [servidores, setServidores] = useState([]);
  const [servidoresFiltrados, setServidoresFiltrados] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ coluna: '', ordem: 'asc' });
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [nomeFiltro, setNomeFiltro] = useState('');
  const [perfilFiltro, setPerfilFiltro] = useState('');
  const [matriculaFiltro, setMatriculaFiltro] = useState('');

  const perfilMap = {
    'GestaoEscolar': 'Gestão Escolar',
    'RegistroEscolar': 'Registros Escolares',
    'Coordenador': 'Coordenador',
    'Professor': 'Professor'
  };

  const fetchServidores = async () => {
    try {
      const response = await servidorService.listar()
      setServidores(response.data);
      setServidoresFiltrados(response.data)
      console.log(response.data)
      console.log(servidoresFiltrados)
    } catch (error) {
      console.error('Erro ao buscar servidores:', error);
    }
  };

  const ordenarPorColuna = (coluna) => {
    const novaOrdem = ordenacao.coluna === coluna && ordenacao.ordem === 'asc' ? 'desc' : 'asc';
  
    const servidoresOrdenados = [...servidoresFiltrados].sort((a, b) => {
      let valorA = a[coluna] || '-';  // Valor A ou "-"
      let valorB = b[coluna] || '-';  // Valor B ou "-"
  
      // Tratar a coluna 'perfil' usando o mapeamento específico
      if (coluna === 'perfil') {
        valorA = perfilMap[a.perfil] || '-';
        valorB = perfilMap[b.perfil] || '-';
      }
  
      // Puxar valores preenchidos ("-") para o fim, independente da ordem
      if (valorA === '-' && valorB !== '-') return 1;  // Coloca "-" depois
      if (valorA !== '-' && valorB === '-') return -1; // Coloca preenchidos antes
  
      // Se ambos são preenchidos ou ambos são vazios ("-"), ordenar normalmente
      return valorA < valorB ? (novaOrdem === 'asc' ? -1 : 1) : (valorA > valorB ? (novaOrdem === 'asc' ? 1 : -1) : 0);
    });
  
    setServidoresFiltrados(servidoresOrdenados);
    setOrdenacao({ coluna, ordem: novaOrdem });
  };

  const limparBusca = () => {
    setDataInicio('');
    setDataFim('');
    setNomeFiltro('');
    setPerfilFiltro('');
    setMatriculaFiltro('');
    fetchServidores();

    setOrdenacao({ coluna: '', ordem: 'asc' });

    fetchServidores();
  };


  useEffect(() => {
    fetchServidores();
  }, []);

  

  const filtrarServidores = () => {
    const servidoresFiltrados = servidores.filter(servidor => 
      (!nomeFiltro || servidor.first_name.toLowerCase().includes(nomeFiltro.toLowerCase())) &&
      (!dataInicio || new Date(servidor.data_ingresso) >= new Date(dataInicio)) &&
      (!dataFim || new Date(servidor.data_ingresso) <= new Date(dataFim)) &&
      (!perfilFiltro || servidor.perfil === perfilFiltro) &&
      (!matriculaFiltro || (servidor.matricula && servidor.matricula.includes(matriculaFiltro)))
    );
    setServidoresFiltrados(servidoresFiltrados);
  };


  const deletarServidor = async (id, nome) => {
    const confirmar = window.confirm(`Você tem certeza que quer remover ${nome}?`);
    if (!confirmar) return;

    try {
        await axios.delete(`http://127.0.0.1:8000/api/deletar-servidor/${id}/`);
        toast.success('Servidor removido do sistema.', { className:"toast-success"});
        fetchServidores();
    } catch (error) {
        console.error('Erro ao deletar servidor:', error);
        toast.error('Erro ao remover servidor.');
    }
};

return (
  <>
    <ToastContainer />
    <FormContainer titulo='Lista de Servidores'>
      <section className='sectionListarServidor'>
        <div className='divListarServidor'>
          <span className="spanListarServidor">
            <label className='labelListarServidor'>Filtrar por Nome</label>
            <Input 
              tipo='text'
              valor={nomeFiltro}
              onChange={(e) => setNomeFiltro(e.target.value)}/>
          </span>
          <span className="spanListarServidor">
            <label className='labelListarServidor'>Filtrar por Perfil</label>
            <select
              className='selectListarServidor'
              value={perfilFiltro}
              onChange={(e) => setPerfilFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="GestaoEscolar">Gestão Escolar</option>
              <option value="RegistroEscolar">Registros Escolares</option>
              <option value="Coordenador">Coordenador</option>
              <option value="Professor">Professor</option>
            </select>
          </span>
          <span className="spanListarServidor">
            <label className='labelListarServidor'>Filtrar por Matrícula</label>
            <Input
              tipo='text'
              valor={matriculaFiltro}
              onChange={(e) => {setMatriculaFiltro(e.target.value)}}
            />
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
    </span>
    <div className='tabelaContainerListarServidor'>
      <table className='tabelaListarServidor'>
        <thead className='cabecalhoListarServidor'>
          <tr className='linhaListarServidor'>
            <th onClick={() => ordenarPorColuna('perfil')}>
              <div className="th-conteudo">
                <img
                  className="icone-ordenar"
                  src={Ordenar}
                  alt="Ordenar"
                  style={{ cursor: 'pointer', marginLeft: '8px' }}
                  title="Ordenar"
                  />
                  <p>Perfil</p>
                {ordenacao.coluna === 'perfil' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
                )}
              </div>
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {servidoresFiltrados.map((servidor) => (
            <tr key={`${servidor.id}-${servidor.nome}`}>
              <td>{perfilMap[servidor.perfil] || '-'}</td>
              <td>{servidor.first_name || '-'}</td>
              <td>{servidor.cpf || '-'}</td>
              <td>{servidor.matricula || '-'}</td>
              <td>{servidor.email || '-'}</td>
              <td>{servidor.data_ingresso || '-'}</td>
              <td className='icone-container'>
              <img 
                className='iconeAcoes'
                src={Visualizar} 
                alt="Visualizar" 
                onClick={() => console.log('Visualizar servidor')} 
                title="Visualizar"/>
              <img 
                className='iconeAcoes'
                src={Deletar} 
                alt="Deletar" 
                onClick={() => deletarServidor(servidor.id, servidor.nome)} 
                title="Deletar"/>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </FormContainer>
  </>
);

};

export default ListarServidor;
