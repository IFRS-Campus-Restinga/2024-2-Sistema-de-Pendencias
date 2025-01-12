import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import DetalhesDependencia from "../../../../components/DetalhesDependencia/DetalhesDependencia"
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS"
import loadingPPT from '../../../../assets/loading-ppt.png'
import { PPTService } from "../../../../services/pptService"


const DetalhesPPTGestao
 = () => {
    const [PPT, setPPT] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const pptId = useLocation().state.id

    const fetchDetalhesPPT = async () => {
        try {
            const res = await PPTService.porId(pptId, 'detalhes')

            if (res.status !== 200) throw new Error(res)

            setPPT(res.data)
            setIsLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchDetalhesPPT()
    }, [])

    if (isLoading) return <LoadingIFRS icone={loadingPPT}/>

    return (
        <DetalhesDependencia dependencia={PPT} modalidade={null} tipo={'PPT'}/>
    )
}

export default DetalhesPPTGestao
