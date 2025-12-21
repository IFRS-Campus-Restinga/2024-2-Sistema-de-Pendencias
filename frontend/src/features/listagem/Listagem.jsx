import { useEffect, useState } from "react"
import BarraPesquisa from "../../components/BarraPesquisa/BarraPesquisa"
import FormContainer from "../../components/FormContainer/FormContainer"
import Tabela from "../../components/Tabela/Tabelas/Tabela"
import styles from "./Listagem.module.css"
import { useNavigate } from "react-router-dom"

const Listagem = ({titulo, fetchDados, urlCadastro, propMap, editar, visualizar, comprimento}) => {
    const navigate = useNavigate()
    const [filtro, setFiltro] = useState()
    const [lista, setLista] = useState([])
    const [pagina, setPagina] = useState(1)
    const [anterior, setAnterior] = useState(null)
    const [proxima, setProxima] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [cursor, setCursor] = useState(null)

    const buscar = async (cursorBusca = cursor) => {
        setCarregando(true)

        try {
            const {proxima, anterior, resultados} = await fetchDados(pagina, filtro, cursorBusca)
            
            setLista(pagina > 1 ? [...lista, ...resultados] : [...resultados])
            setCursor(resultados.length > 0 ? resultados[resultados.length - 1 ].data_criacao : null)
            
            if (proxima) setProxima(pagina + 1)
            if (anterior) setAnterior(pagina - 1)
        } catch (error) {
            console.error(error)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        buscar()
    }, [pagina])

    useEffect(() => {
        if (filtro === '') buscar(null)
    }, [filtro])    

    return (
        <>
            <FormContainer titulo={`Gerenciar ${titulo}`} comprimento={comprimento ?? '70%'}>
                <div className={styles.container}>
                    <BarraPesquisa 
                        setFiltro={(value) => {
                            if (value === '') setLista([])
                            setCursor(null)
                            setPagina(1)
                            setProxima(null)
                            setAnterior(null)
                            setFiltro(value)
                        }} 
                        onSearch={() => {
                            if (filtro === '') setLista([])
                            setCursor(null)
                            setPagina(1)
                            setProxima(null)
                            setAnterior(null)
                            buscar(null)
                        }} 
                        filtro={filtro} 
                    />
                    {
                        urlCadastro ? (
                            <div className={styles.addIcone} 
                                onClick={() => {
                                    const tituloNormalizado = titulo?.trim().normalize("NFC")
                                    if (["PEDs Integrado", "Atividades Integrado"].includes(tituloNormalizado)) {
                                        navigate(urlCadastro, {state: {modalidade: "Integrado"}})
                                    } else if (["PEDs ProEJA", "Atividades ProEJA"].includes(tituloNormalizado)) {
                                        navigate(urlCadastro, {state: {modalidade: "ProEJA"}})
                                    } else {
                                        navigate(urlCadastro)
                                    }
                                }}
                            >
                                +
                            </div>
                        ) : null
                    }
                </div>
                    <Tabela
                        fetchDados={buscar}
                        lista={lista}
                        carregando={carregando}
                        anterior={anterior}
                        proxima={proxima}
                        setPagina={setPagina}
                        visualizar={visualizar}
                        editar={editar}
                        propMap={propMap}
                    />
            </FormContainer>
        </>
    )
}

export default Listagem