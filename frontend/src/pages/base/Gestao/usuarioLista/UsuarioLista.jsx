import { useLocation } from "react-router-dom"
import Listagem from "../../../../features/listagem/Listagem"
import { UsuarioService } from "../../../../services/usuarioService"

const UsuarioMap = {
    'username': 'nome',
    'email': 'email',
    'group': 'grupo',
    'data_criacao': 'data de criação'
}

const UsuarioLista = () => {
    const location = useLocation()
    const perfilUsuarios = location.pathname.split('/')[3]

    const fetchUsuarios = async (pagina, param, cursor) => {
        const res = await UsuarioService.listarPerfil(perfilUsuarios === 'alunos' ? 'aluno' : 'servidor', pagina, param, 'id, username, email, data_criacao', cursor)
        
        return {
            proxima: res.data.next,
            anterior: res.data.previous,
            resultados: res.data.results
        }
    }

    return (
        <Listagem
            fetchDados={fetchUsuarios}
            titulo={perfilUsuarios}
            urlCadastro={`/session/gestao_escolar/${perfilUsuarios}/cadastro/`}
            propMap={UsuarioMap}
            visualizar={false}
            editar={true}
        />
    )
}

export default UsuarioLista