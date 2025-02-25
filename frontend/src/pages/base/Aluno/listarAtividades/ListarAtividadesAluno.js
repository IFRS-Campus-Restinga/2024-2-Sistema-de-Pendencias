import AtividadesDependencia from "../../../../components/AtividadesDependencia/AtividadesDependencia"
import { useEffect, useState } from "react"
import atividadeService from "../../../../services/atividadeService"
import { useLocation } from "react-router-dom"
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS"


const ListarAtividadesAluno = () => {
    const location = useLocation()
    const { state } = location
    const modalidade = location.pathname.split('/')[4]
    const [atividade, setATividades] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchAtividades = async () => {
        try {
            const res = await atividadeService.listarPorPED(state.id, modalidade)

            if (res.status !== 200) throw new Error(res.mensagem)
            
            setATividades(res.data)
            setIsLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchAtividades()
    }, [])

    if (isLoading) return <LoadingIFRS/>

    return (
        <AtividadesDependencia atividades={atividade} editar={false} visualizar={true}/>
    )
}

export default ListarAtividadesAluno