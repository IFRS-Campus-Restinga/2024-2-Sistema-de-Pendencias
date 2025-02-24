import { useEffect, useState } from "react"
import AtividadesDependencia from "../../../../components/AtividadesDependencia/AtividadesDependencia"
import atividadeService from "../../../../services/atividadeService"


const ListarAtividadesProfessor = () => {
    const [atividades, setAtividades] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchAtividades = async () => {
        try {
            const res = await atividadeService.listarPorProfessor()

            if (res.status !== 200) throw new Error(res)
            
            setAtividades(res.data)
            setIsLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchAtividades()
    }, [])

    return (
        <AtividadesDependencia atividades={atividades} editar={true}/>
    )
}

export default ListarAtividadesProfessor