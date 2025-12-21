import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import DetalhesDependencia from "../../../../components/DetalhesDependencia/DetalhesDependencia"
import { PEDService } from "../../../../services/pedService"
import { AxiosError } from "axios"
import { toast } from "react-toastify"
import CustomLoading from "../../../../components/customLoading/CustomLoading"


const DetalhesPEDProfessor = () => {
    const [PED, setPED] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const modalidade = useLocation().pathname.split('/')[4]
    const pedId = useLocation().state

    const fetchDetalhesPED = async () => {
        try {
            const res = await PEDService.porId(
                pedId,
                modalidade,
                `   
                    id, 
                    aluno, 
                    professores, 
                    professor_disciplina, 
                    curso, 
                    disciplina, 
                    trimestre_recuperar, 
                    data_inicio, 
                    data_final, 
                    status, 
                    situacao,
                    turma_atual,
                    serie_progressao,
                    observacao,
                    plano_estudos,
                    form_encerramento,
                    ano_semestre_reprov
                    `,
                'flat' 
            )

            setPED(res.data)
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
        fetchDetalhesPED()
    }, [])

    if (isLoading) return <CustomLoading />

    return (
        <DetalhesDependencia dependencia={PED} fetchDependencia={fetchDetalhesPED} modalidade={modalidade} tipo={'PED'} grupo={JSON.parse(sessionStorage.getItem('user')).group} />
    )
}

export default DetalhesPEDProfessor
