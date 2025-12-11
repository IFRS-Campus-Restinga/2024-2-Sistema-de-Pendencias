import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import DetalhesDependencia from "../../../../components/DetalhesDependencia/DetalhesDependencia"
import { PPTService } from "../../../../services/pptService"
import CustomLoading from "../../../../components/customLoading/CustomLoading"
import { AxiosError } from "axios"
import { toast } from "react-toastify"


const DetalhesPPTCoordenador = () => {
    const [PPT, setPPT] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const pptId = useLocation().state

    const fetchDetalhesPPT = async () => {
        try {
            const res = await PPTService.porId(
                pptId, 
                `
                    id,
                    aluno,
                    professor_disciplina,
                    professor_ppt,
                    curso,
                    disciplina,
                    turma_atual,
                    turma_progressao,
                    data_inicio,
                    data_final,
                    status,
                    situacao,
                    observacao,
                `,
                'flat'
            )

            setPPT(res.data)
        } catch (error) {
            if (error instanceof AxiosError){
                console.error(error.response?.data.message)
            } else{
                console.error(error)
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDetalhesPPT()
    }, [])

    if (isLoading) return <CustomLoading/>

    return (
        <DetalhesDependencia dependencia={PPT} modalidade={null} tipo={'PPT'} grupo={JSON.parse(sessionStorage.getItem('user')).group} />
    )
}

export default DetalhesPPTCoordenador
