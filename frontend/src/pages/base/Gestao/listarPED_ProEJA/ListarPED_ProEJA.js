import { useEffect, useState } from "react"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import Tabela from "../../../../components/Tabela/Tabela"
import { PEDService } from "../../../../services/pedService"



const ListarPEDProEJA = () => {
    const [listaPED_ProEJA, setListaPED_ProEJA] = useState([])

    const fetchPED_ProEJA = async () => {
        try {
            const res = await PEDService.listaProEJA()

            if (res.status !== 200) throw new Error(res)

            setListaPED_ProEJA(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchPED_ProEJA()
    },[])


    return(
        <FormContainer titulo='Dependências - ProEJA' comprimento='95%'>
            <div className="divListarPED_ProEJA">

            </div>
            <div className="tabelaContainerListaPED_ProEJA">
                <Tabela listaFiltrada={listaPED_ProEJA} fontSize={'10px'}/>
            </div>
        </FormContainer>
    )
}

export default ListarPEDProEJA