import { useEffect, useState } from "react"
import { PEDService } from "../../../../services/pedService"
import Tabela from "../../../../components/Tabela/Tabela"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import { jwtDecode } from "jwt-decode"



const ListarPEDProEJAProfessor = () => {
    const [PED, setPED] = useState([])

    const fetchPED = async () => {
        try {
            const res = await PEDService.listaProEJA(jwtDecode(sessionStorage.getItem('token')).idUsuario)

            if (res.status !== 200) throw new Error(res.data.message)

            setPED(res.data)
            console.log(res.data)
        } catch (error) {
            console.error('Erro ao buscar as PEDs', error)
        }
    }

    useEffect(() => {
        fetchPED()
    }, [])

    return (
        <FormContainer titulo='Minhas PEDs - EMI' comprimento='90%'>
            <div className="divListarPEDProfessor"></div>
            <Tabela listaFiltrada={PED} fontSize={'10px'}/>
        </FormContainer>
        
    )
}

export default ListarPEDProEJAProfessor