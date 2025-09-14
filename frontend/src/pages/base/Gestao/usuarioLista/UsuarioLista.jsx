import { useLocation } from "react-router-dom"
import Listagem from "../../../../features/listagem/Listagem"
import { UsuarioService } from "../../../../services/usuarioService"

const UsuarioMap = {
    'username': 'nome',
    'email': 'email',
    'group': 'grupo'
}

const UsuarioLista = () => {
    const location = useLocation()
    const perfilUsuarios = location.pathname.split('/')[3]    
    const fetchUsuarios = async (pagina, param) => {
        const res = await UsuarioService.listar(perfilUsuarios === 'alunos' ? 'aluno' : 'servidor', pagina, param)

        return {
            proxima: res.data.next,
            anterior: res.data.previous,
            lista: res.data.results
        }
    }

    return (
        <Listagem
            fetchDados={fetchUsuarios}
            titulo={perfilUsuarios}
            urlCadastro={`/session/gestao_escolar/${perfilUsuarios}/cadastro/`}
            propMap={UsuarioMap}
        />
    )
}

export default UsuarioLista