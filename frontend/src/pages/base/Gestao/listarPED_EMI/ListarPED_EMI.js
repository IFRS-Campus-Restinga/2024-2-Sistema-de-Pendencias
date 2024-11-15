import { useEffect, useState } from "react"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import Tabela from "../../../../components/Tabela/Tabela"
import { PEDService } from "../../../../services/pedService"



const ListarPEDEMI = () => {
    const [listaPED_EMI, setListaPED_EMI] = useState([])

    const fetchPED_EMI = async () => {
        try {
        const res = await PEDService.listaEMI()
        
        if (res.status !== 200) throw new Error(res)

        setListaPED_EMI(res.data)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchPED_EMI()
    }, [])
    return (
        <FormContainer titulo='Dependências - EMI' comprimento='95%'>
            <div className="divListarPED_EMI">

            </div>
            <Tabela listaFiltrada={listaPED_EMI} fontSize={'10px'}/>
        </FormContainer>
    )
}

export default ListarPEDEMI