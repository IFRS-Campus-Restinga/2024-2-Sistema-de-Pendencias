import FormContainer from '../../../../components/FormContainer/FormContainer'
import Tabela from '../../../../components/Tabela/Tabela'
import styles from './ListarCalendarios.module.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BarraPesquisa from '../../../../components/BarraPesquisa/BarraPesquisa'
import IconeAdicionar from '../../../../assets/icone-adicionar-calendario.png'
import Loading from '../../../../components/Loading/Loading'
import { calendarioAcademicoService } from '../../../../services/calendarioAcademicoService'

const ListarCalendario = () => {
    const [carregando, setCarregando] = useState(true);
    const [carregandoTabela, setCarregandoTabela] = useState(false)
    const [calendarios, setCalendarios] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [proximaURL, setProximaURL] = useState(null)
    const [filtroGeral, setFiltroGeral] = useState('');
    const navigate = useNavigate();

    const fetchCalendariosPagina = async () => {
        setCarregandoTabela(true)
        try {
            const res = await calendarioAcademicoService.listar('lista', filtroGeral, pagina);

            setCalendarios((prev) => [...prev, ...res.data.results])

            setProximaURL(res.data.next)
        } catch (error) {
            console.error(error.mensagem);
        } finally {
            setCarregando(false);
            setCarregandoTabela(false)
        }
    };

    const fetchCalendariosFiltro = async () => {
        setCarregandoTabela(true)
        try {
            const res = await calendarioAcademicoService.listar('lista', filtroGeral, pagina);

            setCalendarios(res.data.results)

            setProximaURL(res.data.next)
        } catch (error) {
            console.error(error.mensagem);
        } finally {
            setCarregando(false);
            setCarregandoTabela(false)
        }
    }

    useEffect(() => {
        if (proximaURL) fetchCalendariosPagina();
    }, [pagina]);

    useEffect(() => {
        if (filtroGeral === '') fetchCalendariosFiltro();
    }, [filtroGeral]);

    return (
        <>
            <FormContainer titulo='Lista de Calendarios' comprimento='90%'>
                <div className={styles.container}>
                    <BarraPesquisa setFiltro={setFiltroGeral} fetchDados={fetchCalendariosFiltro} filtro={filtroGeral} setPagina={setPagina} />
                    <div>
                        <img
                            className={styles.iconeAdicionarCalendario}
                            src={IconeAdicionar}
                            onClick={() => navigate(`/Gestão Escolar/cadastroCalendario`)}
                            title='Cadastrar Calendario'
                        />
                    </div>
                </div>
                <div className={styles.containerTabela}>
                    {
                        carregando ? (
                            <Loading border={'green'} />
                        ) : (
                            <Tabela
                                listaFiltrada={calendarios}
                                editar={true}
                                visualizar={true}
                                setPagina={setPagina}
                                proximaURL={proximaURL}
                                carregando={carregandoTabela}
                            />
                        )
                    }
                </div>
            </FormContainer>
        </>
    );
};

export default ListarCalendario;