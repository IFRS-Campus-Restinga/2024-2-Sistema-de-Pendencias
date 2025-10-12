import Listagem from "../../../../features/listagem/Listagem"
import GrupoService from "../../../../services/grupoService"

const GrupoMap = {
    'name': 'nome'
}

const GrupoLista = () => {   
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
            urlCadastro={'/session/gestao_escolar/grupos/cadastro/'}
            propMap={GrupoMap}
            visualizar={false}
            editar={true}
        />
    )
}

export default GrupoLista