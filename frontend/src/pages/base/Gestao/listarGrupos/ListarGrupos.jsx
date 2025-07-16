import Listagem from "../../../../features/listagem/Listagem"
import GrupoService from "../../../../services/grupoService"

const ListarGrupos = () => {   
    const fetchGrupos = async (pagina, param) => {
        const res = await GrupoService.listar(pagina, param)

        return {
            proxima: res.data.next,
            anterior: res.data.previous,
            lista: res.data.results
        }
    }

    return (
        <Listagem
            fetchDados={fetchGrupos}
            titulo={'Grupos'}
            urlCadastro={'/gestao_escolar/grupos/cadastro/'}
        />
    )
}

export default ListarGrupos