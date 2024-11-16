import { useEffect, useState } from "react"
import { PEDService } from "../../../../services/pedService"
import { jwtDecode } from "jwt-decode"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import './ListarPED_EMIProfessor.css'
import Tabela from "../../../../components/Tabela/Tabela"


const ListarPEDEMIProfessor = () => {
    const [PED, setPED] = useState([])

    const fetchPED = async () => {
        try {
            const res = await PEDService.listaEMI(jwtDecode(sessionStorage.getItem('token')).idUsuario)

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

export default ListarPEDEMIProfessor