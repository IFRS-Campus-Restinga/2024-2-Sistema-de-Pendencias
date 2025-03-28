import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { PEDService } from "../../../../services/pedService"
import ListarDependencias from "../../../../components/ListarDependencias/ListarDependencias"
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS"
import loadingEMI from '../../../../assets/loading-peds-emi.png'
import loadingProEJA from '../../../../assets/loading-peds-proeja.png'
import { jwtDecode } from "jwt-decode"


const ListarPEDProfessor = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [listaPED, setListaPED] = useState([])
    const location = useLocation()
    const [modalidade, setModalidade] = useState(location.pathname.split('/')[5])
    
    const fetchPED = async () => {
        setIsLoading(true);
        setListaPED([]);

        try {
            const res = await PEDService.listar(jwtDecode(sessionStorage.getItem('token')).idUsuario, 'lista', modalidade)
            
            if (res.status !== 200) throw new Error(res)

            setListaPED(res.data)
            setIsLoading(false)
        } catch (erro) {
            console.error(erro)
        }
    }

    useEffect(() => {
        fetchPED()
    },[modalidade])

    useEffect(() => {
        setModalidade(location.pathname.split('/')[5])
    }, [location])

    if (isLoading) return <LoadingIFRS icone={modalidade === 'Integrado' ? loadingEMI : loadingProEJA}/>

    return (
        <ListarDependencias editar={false} visualizar={true} listaDependencias={listaPED} modalidade={modalidade} tipo={'PED'} />
    )
}

export default ListarPEDProfessor