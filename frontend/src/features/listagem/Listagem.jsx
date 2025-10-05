import { useState } from "react"
import BarraPesquisa from "../../components/BarraPesquisa/BarraPesquisa"
import FormContainer from "../../components/FormContainer/FormContainer"
import Tabela from "../../components/Tabela/Tabelas/Tabela"
import styles from "./Listagem.module.css"
import { useNavigate } from "react-router-dom"

const Listagem = ({titulo, fetchDados, urlCadastro, propMap, editar, visualizar}) => {
    const navigate = useNavigate()
    const [filtro, setFiltro] = useState('')
    const [lista, setLista] = useState([])
    const [pagina, setPagina] = useState(1)
    const [anterior, setAnterior] = useState(null)
    const [proxima, setProxima] = useState(null)
    const [carregando, setCarregando] = useState(true)

    const buscar = async (pagina, param) => {
        setCarregando(true)

        try {
            const {proxima, anterior, lista} = await fetchDados(pagina, param)
            
            setLista(lista)

            if (proxima) setProxima(pagina + 1)
            if (anterior) setAnterior(pagina - 1)
        } catch (error) {
            console.error(error)
        } finally {
            setCarregando(false)
        }
    }

    return (
        <>
            <FormContainer titulo={`Gerenciar ${titulo}`} comprimento='70%'>
                <div className={styles.container}>
                    <BarraPesquisa 
                        setFiltro={setFiltro} 
                        onSearch={(pagina, param) => {
                            setPagina(1)
                            buscar(pagina, param)
                        }} 
                        filtro={filtro} 
                    />
                    {
                        urlCadastro ? (
                            <div className={styles.addIcone} onClick={() => navigate(urlCadastro)}>+</div>
                        ) : null
                    }
                </div>
                    <Tabela
                        fetchDados={buscar}
                        lista={lista}
                        carregando={carregando}
                        pagina={pagina}
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