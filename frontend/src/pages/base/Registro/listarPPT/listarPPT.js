import { useEffect, useState } from 'react';
import './listarPPT.css';
import { PPTService } from '../../../../services/emiPptService';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import Button from '../../../../components/Button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Tabela from '../../../../components/Tabela/Tabela';
import X from "../../../../assets/x-branco.png";
import Lupa from "../../../../assets/lupa-branca.png";
import AdicionarPPT from "../../../../assets/adicionar-livro.png";

const ListarPPTRegistro = () => {
    const navegar = useNavigate();
    const [listaPPT, setListaPPT] = useState([]);
    const [dependenciasFiltradas, setDependenciasFiltradas] = useState([]);
    const [filtroGeral, setFiltroGeral] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [status, setStatus] = useState('');
    const [situacao, setSituacao] = useState('');

    const navigate = useNavigate();


    const fetchPPT = async () => {
        try {
            const res = await PPTService.list();

            if (res.status !== 200) throw new Error(res.response.data.mensagem);

            setListaPPT(res.data);
            setDependenciasFiltradas(res.data); // Carregar lista completa ao iniciar
        } catch (error) {
            console.error('Erro ao buscar PPTs: ', error);
        }
    };

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
        const dependenciasFiltradas = listaPPT.filter((ppt) => {
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

    useEffect(() => {
        fetchPPT();
    }, []);

    return (
        <>
            <FormContainer titulo='Lista de PPT' comprimento='90%'
                onSubmit={(e) => {
                    e.preventDefault();
                    filtrarPPT();
                }}>
                    <div>
                        <h1>lorem ipsummmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm</h1>
                    </div>
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
                </div>
                <Tabela listaFiltrada={dependenciasFiltradas} fontSize='10px' />
            </FormContainer>
        </>
    );
};

export default ListarPPTRegistro;
