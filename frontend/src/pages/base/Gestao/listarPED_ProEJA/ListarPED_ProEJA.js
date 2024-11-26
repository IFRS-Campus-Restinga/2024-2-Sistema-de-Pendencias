import { useEffect, useState } from "react"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import Tabela from "../../../../components/Tabela/Tabela"
import Input from "../../../../components/Input/Input"
import Button from '../../../../components/Button/Button'
import { PEDService } from "../../../../services/pedService"
import './ListarPED_ProEJA.css'
import X from "../../../../assets/x-branco.png";
import Lupa from "../../../../assets/lupa-branca.png";


const ListarPEDProEJA = () => {
    const [listaPED_ProEJA, setListaPED_ProEJA] = useState([])
    const [listaFiltrada, setListaFiltrada] = useState([])
    const [filtroGeral, setFiltroGeral] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [status, setStatus] = useState('');
    const [situacao, setSituacao] = useState('');

    const fetchPED_ProEJA = async () => {
        try {
            const res = await PEDService.listaProEJA()

            if (res.status !== 200) throw new Error(res)

            setListaPED_ProEJA(res.data)
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
        const PEDsFiltradas = listaPED_ProEJA.filter((ped) => {
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
        fetchPED_ProEJA()
    }, [])

    return (
        <FormContainer titulo='Dependências - ProEJA' comprimento='95%'
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

            <Tabela listaFiltrada={listaFiltrada} fontSize={'10px'} />
        </FormContainer>
    )
}

export default ListarPEDProEJA