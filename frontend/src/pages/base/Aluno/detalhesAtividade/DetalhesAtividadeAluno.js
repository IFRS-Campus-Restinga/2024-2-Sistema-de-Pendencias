import { useLocation } from "react-router-dom"
import DetalhesAtividade from "../../../../components/AtividadesDependencia/DetalhesAtividade/DetalhesAtividade"
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS"
import { useEffect, useState } from "react"
import atividadeService from "../../../../services/atividadeService"


const DetalhesAtividadeAluno = () => {
    const location = useLocation()
    const { state } = location
    const modalidade = location.pathname.split('/')[4]
    const [atividade, setAtividade] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchAtividade = async () => {
        try {
            const res = await atividadeService.porAvaliacao(state.id, modalidade)

            if (res.status !== 200) throw new Error(res.mensagem)

            setAtividade(res.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAtividade()
    }, [])

    if (isLoading) return <LoadingIFRS/>

    return (
        <DetalhesAtividade atividade={atividade}/>
    )
}

export default DetalhesAtividadeAluno