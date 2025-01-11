import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import DetalhesDependencia from "../../../../components/detalhesDependencia/DetalhesDependencia"
import { PEDService } from "../../../../services/pedService"
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS"
import loadingEMI from '../../../../assets/loading-peds-emi.png'
import loadingProEJA from '../../../../assets/loading-peds-proeja.png'


const DetalhesPEDGestao = () => {
    const [PED, setPED] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const modalidade = useLocation().pathname.split('/')[5]
    const pedId = useLocation().state.id

    const fetchDetalhesPED = async () => {
        try {
            const res = await PEDService.porId(pedId, modalidade, 'detalhes')

            if (res.status !== 200) throw new Error(res)

            setPED(res.data)
            setIsLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchDetalhesPED()
    }, [])

    if (isLoading) return <LoadingIFRS icone={modalidade === 'Integrado' ? loadingEMI : loadingProEJA}/>

    return (
        <DetalhesDependencia dependencia={PED} modalidade={modalidade} tipo={'PED'}/>
    )
}

export default DetalhesPEDGestao