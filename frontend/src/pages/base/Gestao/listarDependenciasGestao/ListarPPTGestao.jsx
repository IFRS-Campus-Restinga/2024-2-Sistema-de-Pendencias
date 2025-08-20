import Listagem from "../../../../features/listagem/Listagem"
import { PPTService } from "../../../../services/pptService"


const ListarPPTGestao = () => {
    const fetchPPTs = async (filtro, pagina) => {
        const res = await PPTService.listar('lista', filtro, pagina)

        return {
            proxima: res.data.next,
            anterior: res.data.prev,
            lista: res.data.result
        }
    }

    return (
        <Listagem
            fetchDados={fetchPPTs}
            titulo={'PPTs'}
            urlCadastro={'/session/gestao_escolar/ppts/cadastro/'}
        />
    )
}

export default ListarPPTGestao