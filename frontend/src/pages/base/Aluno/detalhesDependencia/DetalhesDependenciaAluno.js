import { useLocation } from "react-router-dom"
import DetalhesDependencia from "../../../../components/DetalhesDependencia/DetalhesDependencia"
import { useEffect, useState } from "react"
import { PEDService } from "../../../../services/pedService"
import { PPTService } from "../../../../services/pptService"
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS"
import { de } from "date-fns/locale"


const DetalhesDependenciaAluno = () => {
    const location = useLocation()
    const { state } = location
    const modalidade = location.pathname.split('/')[4] ?? null
    const [dependencia, setDependencia] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [tipo, setTipo] = useState(null)

    const fetchDependencia = async () => {
        let res
        try {
            if (modalidade) {
                res = await PEDService.porId(state.id, modalidade, 'aluno')
                setTipo('PED')
            } else {
                res = await PPTService.porId(state.id, 'aluno')
                setTipo('PPT')  
            }

            if (res.status !== 200) throw new Error(res)
            
            setDependencia(res.data)
            setIsLoading(false)
        } catch (error) {
            console.error(error)
        }        
    }

    useEffect(() => {
        fetchDependencia()
    }, [])

    if (isLoading) return <LoadingIFRS/>

    return (
        <DetalhesDependencia dependencia={dependencia} grupo={'Aluno'} tipo={tipo} modalidade={modalidade}/>
    )
}

export default DetalhesDependenciaAluno