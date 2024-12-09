import { useEffect, useState } from "react"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import Tabela from "../../../../components/Tabela/Tabela"
import { PEDService } from "../../../../services/pedService"
import Input from "../../../../components/Input/Input"
import X from "../../../../assets/x-branco.png";
import Lupa from "../../../../assets/lupa-branca.png";
import './ListarPED_EMIProfessor.css'
import {jwtDecode} from 'jwt-decode'


const ListarPEDEMIProfessor = () => {
    const [listaPED_EMI, setListaPED_EMI] = useState([])
    const [listaFiltrada, setListaFiltrada] = useState([])
    const [filtroGeral, setFiltroGeral] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [status, setStatus] = useState('');
    const [situacao, setSituacao] = useState('');

    const fetchPED_EMI = async () => {
        try {
            const res = await PEDService.listaEMI(jwtDecode(sessionStorage.getItem('token')).idUsuario, 'lista')

            if (res.status !== 200) throw new Error(res)

            setListaPED_EMI(res.data)
            setListaFiltrada(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const limparBusca = () => {
        setDataInicio('');
        setDataFim('');
        setFiltroGeral('');
        setStatus('');
        setSituacao('');
    };

    const removeAcentos = (str) =>
        str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

    const filtrarPEDs = () => {
        const PEDsFiltradas = listaPED_EMI.filter((ped) => {
            const filtroGeralAtende = !filtroGeral ||
                Object.values(ped).some((campo) =>
                    removeAcentos(campo?.toString().toLowerCase()).includes(
                        removeAcentos(filtroGeral.toLowerCase())
                    )
                );

            return (
                filtroGeralAtende &&
                (!dataInicio || new Date(ped.data_inicio) >= new Date(dataInicio)) &&
                (!dataFim || new Date(ped.data_final) <= new Date(dataFim)) &&
                (!status || removeAcentos(ped.status).toLowerCase() === removeAcentos(status).toLowerCase()) &&
                (!situacao || removeAcentos(ped.situacao).toLowerCase() === removeAcentos(situacao).toLowerCase())
            );
        });

        setListaFiltrada(PEDsFiltradas);
    };

    useEffect(() => {
        fetchPED_EMI()
    }, [])

    return (
        <FormContainer titulo='Minhas PEDs - EMI' comprimento='95%'
            onSubmit={(e) => {
                e.preventDefault();
                filtrarPEDs();
            }}>
            <div className='containerBuscarPED'>
                <div class="buscaBarPED">
                    <Input
                        tipo='search'
                        valor={filtroGeral}
                        onChange={(e) => setFiltroGeral(e.target.value)}
                        textoAjuda={'Buscar por aluno, professor, status, curso...'}
                    />
                    <img
                        className='iconesBuscarPED'
                        src={Lupa}
                        onClick={filtrarPEDs}
                        title='Buscar'
                    />
                    <img
                        className='iconesBuscarPED'
                        src={X}
                        onClick={limparBusca}
                        title='Limpar Busca'
                    />
                </div>
            </div>
            <Tabela listaFiltrada={listaFiltrada} visualizar={true}/>
        </FormContainer>
    )
}

export default ListarPEDEMIProfessor