import { useLocation } from "react-router-dom"
import Listagem from "../../../../features/listagem/Listagem"
import { PEDService } from "../../../../services/pedService"


const ListarPEDGestao = () => {
    const location = useLocation()
    const modalidade = location.pathname.split('/')[4]

    const fetchPEDs = async (filtro, pagina) => {
        const res = await PEDService.listar('lista', filtro, pagina, modalidade)

        return {
            proxima: res.data.next,
            anterior: res.data.prev,
            lista: res.data.results
        }
    }

    return (
        <Listagem
            fetchDados={fetchPEDs}
            titulo={`PEDs ${modalidade}`}
            urlCadastro={'/session/gestao_escolar/peds/cadastro/'}
        />
    )
}

export default ListarPEDGestao