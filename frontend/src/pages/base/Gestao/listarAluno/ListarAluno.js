import React, { useState, useEffect } from 'react';
import './ListarAluno.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import 'react-toastify/dist/ReactToastify.css';
import { alunoService } from '../../../../services/alunoService';
import { usuarioBaseService } from '../../../../services/usuarioBaseService';
import Tabela from '../../../../components/Tabela/Tabela';
import { useNavigate } from 'react-router-dom';
import Lupa from "../../../../assets/lupa-branca.png";
import X from "../../../../assets/x-branco.png";
import { jwtDecode } from 'jwt-decode';
import IconeAdicionar from "../../../../assets/icone-adicionar-usuario.png";

const ListarAluno = () => {
  const [alunos, setAlunos] = useState([]);
  const [alunosFiltrados, setAlunosFiltrados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ coluna: '', ordem: 'asc' });
  const [grupoFiltro, setGrupoFiltro] = useState('');
  const [filtroGeral, setFiltroGeral] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [isActiveFiltro, setIsActiveFiltro] = useState('');
  const [matriculaFiltro, setMatriculaFiltro] = useState('');

  const navigate = useNavigate();

  const handleClick = (aluno) => {
    navigate(`${aluno.id}/detalhesAluno`, { state: { aluno } });
  };

  const fetchAlunos = async () => {
    try {
      const response = await alunoService.listar(); // Requisição para listar alunos

      setAlunos(response.data);
      setAlunosFiltrados(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const fetchGrupos = async () => {
    try {
      const res = await usuarioBaseService.listarGrupos();

      if (res.status !== 200) throw new Error(res);

      const grupos = res.data.filter((grupo) => grupo.name !== 'Professor'); // Apenas Alunos

      setGrupos(grupos);
    } catch (error) {
      console.error('Erro ao buscar grupos: ', error);
    }
  };

  const limparBusca = () => {
    setDataInicio('');
    setDataFim('');
    setFiltroGeral('');
    setGrupoFiltro('');
    setMatriculaFiltro('');
    setIsActiveFiltro('');
    fetchAlunos();
    setOrdenacao({ coluna: '', ordem: 'asc' });
    fetchAlunos();
  };

  const filtrarAlunos = () => {
    const alunosFiltrados = alunos.filter((aluno) => {
      const filtroGeralAtende = !filtroGeral ||
        Object.values(aluno).some((campo) =>
          campo?.toString().toLowerCase().includes(filtroGeral.toLowerCase())
        );

      return (
        filtroGeralAtende &&
        (!dataInicio || new Date(aluno.data_ingresso) >= new Date(dataInicio)) &&
        (!grupoFiltro || aluno.grupo === grupoFiltro) &&
        (!matriculaFiltro || (aluno.matricula && aluno.matricula.includes(matriculaFiltro))) &&
        (!isActiveFiltro || (aluno.is_active && aluno.is_active.includes(isActiveFiltro)))
      );
    });

    setAlunosFiltrados(alunosFiltrados);
  };


  useEffect(() => {
    fetchAlunos();
    fetchGrupos();
  }, []);

  return (
    <>
      <FormContainer titulo='Lista de Alunos' comprimento='90%'>
        <div className='containerBuscarAluno'>
          <div class="buscaBarAluno">
            <Input
              tipo='search'
              valor={filtroGeral}
              onChange={(e) => setFiltroGeral(e.target.value)}
              textoAjuda={'Buscar por nome, e-mail, grupo, status...'}
            />
            <img
              className='iconesBuscarAluno'
              src={Lupa}
              onClick={filtrarAlunos}
              title='Buscar'
            />
            <img
              className='iconesBuscarAluno'
              src={X}
              onClick={limparBusca}
              title='Limpar Busca'
            />
          </div>
          <div className='adicionarAluno'>
            <img
              className='iconeAdicionarAluno'
              src={IconeAdicionar}
              onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroAluno`)}
              title='Cadastrar Aluno'
            />
          </div>
        </div>

        <div className='tabelaContainerListarAluno'>
          <Tabela listaFiltrada={alunosFiltrados} />
        </div>
      </FormContainer>
    </>
  );
};

export default ListarAluno;
