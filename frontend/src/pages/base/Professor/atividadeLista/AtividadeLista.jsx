import { useEffect } from "react"
import atividadeService from "../../../../services/atividadeService"
import Listagem from "../../../../features/listagem/Listagem"
import { useLocation } from "react-router-dom"

const propMap = {
    'id': 'id',
    'titulo': 'título',
}

const ListarAtividadesProfessor = () => {
    const location = useLocation()
    const modalidade = location.pathname.split('/')[4]

    const fetchAtividades = async (pagina, param) => {
        const res = await atividadeService.listar(modalidade, pagina, param, 'id, titulo')

        if (res.status !== 200) throw new Error(res)
        
        return {
            proxima: res.data.next,
            anterior: res.data.prev,
            lista: res.data.results
        }
    }

    useEffect(() => {
        fetchAtividades()
    }, [])

    return (
        <Listagem
            editar={true}
            visualizar={false}
            fetchDados={fetchAtividades}
            propMap={propMap}
            titulo={`Atividades ${modalidade}`}
            urlCadastro={'/session/professor/atividades/cadastrar'}
        />
    )
}

export default ListarAtividadesProfessor