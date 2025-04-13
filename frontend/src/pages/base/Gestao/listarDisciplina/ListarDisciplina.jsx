import FormContainer from '../../../../components/FormContainer/FormContainer'
import Tabela from '../../../../components/Tabela/Tabela'
import { disciplinaService } from '../../../../services/disciplinaService'
import styles from './ListarDisciplina.module.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BarraPesquisa from '../../../../components/BarraPesquisa/BarraPesquisa'
import IconeAdicionar from '../../../../assets/icone-adicionar-disciplina.png'
import Loading from '../../../../components/Loading/Loading'

const ListarDisciplinas = () => {
    const [carregando, setCarregando] = useState(true);
    const [carregandoTabela, setCarregandoTabela] = useState(false)
    const [disciplinas, setDisciplinas] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [proximaURL, setProximaURL] = useState(null)
    const [filtroGeral, setFiltroGeral] = useState('');
    const navigate = useNavigate();

    const fetchDisciplinasPagina = async () => {
        setCarregandoTabela(true)
        try {
            const res = await disciplinaService.listar('lista', filtroGeral, pagina);

            setDisciplinas((prev) => [...prev, ...res.data.results])

            setProximaURL(res.data.next)
        } catch (error) {
            console.error(error.mensagem);
        } finally {
            setCarregando(false);
            setCarregandoTabela(false)
        }
    };

    const fetchDisciplinasFiltro = async () => {
        setCarregandoTabela(true)
        try {
            const res = await disciplinaService.listar('lista', filtroGeral, pagina);

            setDisciplinas(res.data.results)

            setProximaURL(res.data.next)
        } catch (error) {
            console.error(error.mensagem);
        } finally {
            setCarregando(false);
            setCarregandoTabela(false)
        }
    }

    useEffect(() => {
        if (proximaURL) fetchDisciplinasPagina();
    }, [pagina]);

    useEffect(() => {
        if (filtroGeral === '') fetchDisciplinasFiltro();
    }, [filtroGeral]);

    return (
        <>
            <FormContainer titulo='Lista de Disciplinas' comprimento='90%'>
                <div className={styles.container}>
                    <BarraPesquisa setFiltro={setFiltroGeral} fetchDados={fetchDisciplinasFiltro} filtro={filtroGeral} setPagina={setPagina} />
                    <div>
                        <img
                            className={styles.iconeAdicionarDisciplina}
                            src={IconeAdicionar}
                            onClick={() => navigate(`/Gestão Escolar/cadastroDisciplina`)}
                            title='Cadastrar Disciplina'
                        />
                    </div>
                </div>
                <div className={styles.containerTabela}>
                    {
                        carregando ? (
                            <Loading border={'green'} />
                        ) : (
                            <Tabela
                                listaFiltrada={disciplinas}
                                editar={true}
                                visualizar={false}
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

export default ListarDisciplinas;