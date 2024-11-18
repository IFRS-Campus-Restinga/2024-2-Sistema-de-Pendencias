import React, { useState, useEffect } from 'react';
import './ListarAluno.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Button from "../../../../components/Button/Button";
import Input from '../../../../components/Input/Input';
import 'react-toastify/dist/ReactToastify.css';
import { alunoService } from '../../../../services/alunoService';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { usuarioBaseService } from '../../../../services/usuarioBaseService';
import Tabela from '../../../../components/Tabela/Tabela';
import { useNavigate } from 'react-router-dom';

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
    const alunosFiltrados = alunos.filter((aluno) =>
      (!filtroGeral ||
        (aluno.nome && aluno.nome.toLowerCase().includes(filtroGeral.toLowerCase())) ||
        (aluno.matricula && aluno.matricula.includes(filtroGeral)) ||
        (aluno.cpf && aluno.cpf.includes(filtroGeral)) ||
        (aluno.email && aluno.email.includes(filtroGeral)) ||
        (aluno.data_ingresso && new Date(aluno.data_ingresso).toLocaleDateString('pt-BR')).includes(filtroGeral)
      ) &&
      (!dataInicio || new Date(aluno.data_ingresso) >= new Date(dataInicio)) &&
      (!grupoFiltro || aluno.grupo === grupoFiltro) &&
      (!matriculaFiltro || (aluno.matricula && aluno.matricula.includes(matriculaFiltro))) &&
      (!isActiveFiltro || (aluno.is_active && aluno.is_active.includes(isActiveFiltro)))
    );
    setAlunosFiltrados(alunosFiltrados);
  };

  useEffect(() => {
    fetchAlunos();
    fetchGrupos();
  }, []);

  return (
    <>
      <FormContainer titulo='Lista de Alunos' comprimento='90%'>
        <section className='sectionListarAluno'>
          <div className='divListarAluno'>
            <span className="spanListarAluno">
              <label className='labelListarAluno'>Filtrar por Dados Pessoais</label>
              <Input
                tipo='text'
                valor={filtroGeral}
                onChange={(e) => setFiltroGeral(e.target.value)}
              />
            </span>
            
          </div>
          <div className='divListarAluno'>
            <span className="spanFiltroPeriodo">
              <span className='spanData'>
                <label className='labelData'>Buscar por período de ingresso</label>
                <Input
                  valor={dataInicio}
                  tipo='date'
                  onChange={(e) => { setDataInicio(e.target.value) }}
                />
              </span>
            </span>
          </div>
        </section>
        <span className="containerButton">
          <Button
            text="Buscar"
            onClick={filtrarAlunos}
          />
          <Button
            text="Limpar campos"
            onClick={limparBusca}
            color="#4A4A4A"
          />
          <Link to={`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroAluno`}>
            <Button
              text='Adicionar novo'
            />
          </Link>
        </span>
        <div className='tabelaContainerListarAluno'>
          <Tabela listaFiltrada={alunosFiltrados} />
        </div>
      </FormContainer>
    </>
  );
};

export default ListarAluno;
