import './ListarDependencias.css';
import { useEffect, useState } from 'react';
import LoadingIFRS from '../LoadingIFRS/LoadingIFRS';
import FormContainer from '../FormContainer/FormContainer';
import Tabela from '../Tabela/Tabela';
import Input from '../Input/Input';
import X from "../../assets/x-branco.png";
import Lupa from "../../assets/lupa-branca.png";
import AdicionarPPT from "../../assets/adicionar-livro.png";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ListarDependencias = ({listaDependencias, tipo, modalidade, editar, visualizar}) => {
    const [dependenciasFiltradas, setDependenciasFiltradas] = useState([]);
    const [filtroGeral, setFiltroGeral] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [status, setStatus] = useState('');
    const [situacao, setSituacao] = useState('');
    
    console.log(dependenciasFiltradas)

    const navigate = useNavigate();

    const limparBusca = () => {
        setDataInicio('');
        setDataFim('');
        setFiltroGeral('');
        setStatus('');
        setSituacao('');
    };

    const removeAcentos = (str) =>
        str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

    const filtrarDependencias = () => {
        const dependenciasFiltradas = listaDependencias.filter((dependencia) => {
            const filtroGeralAtende = !filtroGeral ||
                // serve para passar por cada elemento da dependencia
                Object.values(dependencia).some((campo) =>
                    removeAcentos(campo?.toString().toLowerCase()).includes(
                        removeAcentos(filtroGeral.toLowerCase())
                    )
                );

            return (
                filtroGeralAtende &&
                (!dataInicio || new Date(dependencia.data_inicio) >= new Date(dataInicio)) &&
                (!dataFim || new Date(dependencia.data_final) <= new Date(dataFim)) &&
                (!status || removeAcentos(dependencia.status).toLowerCase() === removeAcentos(status).toLowerCase()) &&
                (!situacao || removeAcentos(dependencia.situacao).toLowerCase() === removeAcentos(situacao).toLowerCase())
            );
        });

        setDependenciasFiltradas(dependenciasFiltradas);
    };

    useEffect(() => {
        setDependenciasFiltradas(listaDependencias)
    },[modalidade])

    return (
        <>
            <FormContainer titulo={`Lista de ${tipo} ${modalidade ?? ''}`} comprimento='90%'>
                <div className='containerBuscarPPT'>
                    <div class="buscaBarPPT">
                        <Input
                            tipo='search'
                            valor={filtroGeral}
                            onChange={(e) => setFiltroGeral(e.target.value)}
                            textoAjuda={'Buscar por aluno, professor, status, curso...'}
                        />
                        <img
                            className='iconesBuscarPPT'
                            src={Lupa}
                            onClick={filtrarDependencias}
                            title='Buscar'
                        />
                        <img
                            className='iconesBuscarPPT'
                            src={X}
                            onClick={limparBusca}
                            title='Limpar Busca'
                        />
                    </div>
                    <div className='adicionarServidor'>
                        <img
                            className='iconeAdicionarPPT'
                            src={AdicionarPPT}
                            onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/${tipo === 'PED' ? 'cadastroPED' : 'cadastroPPT'}`)}
                            alt='Cadastrar PPT'
                        />
                    </div>
                </div>
                <Tabela listaFiltrada={dependenciasFiltradas} editar={editar} visualizar={visualizar}/>
            </FormContainer>
        </>
    );
};

export default ListarDependencias;
