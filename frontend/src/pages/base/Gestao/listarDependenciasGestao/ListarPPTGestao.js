import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import ListarDependencias from "../../../../components/ListarDependencias/ListarDependencias"
import { PPTService } from "../../../../services/pptService"
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS"
import loadingPPT from '../../../../assets/loading-ppt.png'


const ListarPPTGestao = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [listaPPT, setListaPPT] = useState([])
    
    const fetchPPT = async () => {
        try {
            const res = await PPTService.listar('lista')

            if (res.status !== 200) throw new Error(res)

            setListaPPT(res.data)
            setIsLoading(false)
        } catch (erro) {
            console.error(erro)
        }
    }

    useEffect(() => {
        fetchPPT()
    },[])

    if (isLoading) return <LoadingIFRS icone={loadingPPT}/>

    return (
        <ListarDependencias editar={true} visualizar={true} listaDependencias={listaPPT} tipo={'PPT'} />
    )
}

export default ListarPPTGestao