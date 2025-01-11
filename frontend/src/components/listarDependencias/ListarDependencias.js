import './ListarDependencias.css';
import { useEffect, useState } from 'react';
import LoadingIFRS from '../LoadingIFRS/LoadingIFRS';
import FormContainer from '../FormContainer/FormContainer';
import Tabela from '../Tabela/Tabela';
import Input from '../Input/Input';
import X from "../../assets/x-branco.png";
import Lupa from "../../assets/lupa-branca.png";
import AdicionarPPT from "../../assets/adicionar-livro.png";
import PPT from '../../assets/loading-ppt.png'
import PED_ProEJA from '../../assets/loading-peds-proeja.png'
import PED_EMI from '../../assets/loading-peds-emi.png'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { PPTService } from '../../services/pptService';
import { PEDService } from '../../services/pedService';

const ListarDependencias = ({listaDependencias}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [dependenciasFiltradas, setDependenciasFiltradas] = useState(listaDependencias);
    const [filtroGeral, setFiltroGeral] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [status, setStatus] = useState('');
    const [situacao, setSituacao] = useState('');

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

    const filtrarPPT = () => {
        const dependenciasFiltradas = listaDependencias.filter((ppt) => {
            const filtroGeralAtende = !filtroGeral ||
                // serve para passar por cada elemento da dependencia
                Object.values(ppt).some((campo) =>
                    removeAcentos(campo?.toString().toLowerCase()).includes(
                        removeAcentos(filtroGeral.toLowerCase())
                    )
                );

            return (
                filtroGeralAtende &&
                (!dataInicio || new Date(ppt.data_inicio) >= new Date(dataInicio)) &&
                (!dataFim || new Date(ppt.data_final) <= new Date(dataFim)) &&
                (!status || removeAcentos(ppt.status).toLowerCase() === removeAcentos(status).toLowerCase()) &&
                (!situacao || removeAcentos(ppt.situacao).toLowerCase() === removeAcentos(situacao).toLowerCase())
            );
        });

        setDependenciasFiltradas(dependenciasFiltradas);
    };

    // if (isLoading) return <LoadingIFRS icone={}/>

    return (
        <>
            <FormContainer titulo='Lista de PPT' comprimento='90%'
                onSubmit={(e) => {
                    e.preventDefault();
                    filtrarPPT();
                }}>
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
                            onClick={filtrarPPT}
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
                            onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroPPT`)}
                            title='Cadastrar PPT'
                        />
                    </div>
                </div>
                <Tabela listaFiltrada={dependenciasFiltradas} editar={true} visualizar={true}/>
            </FormContainer>
        </>
    );
};

export default ListarDependencias;
