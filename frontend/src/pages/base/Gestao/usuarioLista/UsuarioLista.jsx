import { useLocation } from "react-router-dom"
import Listagem from "../../../../features/listagem/Listagem"
import { UsuarioService } from "../../../../services/usuarioService"
import { useState } from "react"

const UsuarioMap = {
    'username': 'nome',
    'email': 'email',
    'group': 'grupo'
}

const UsuarioLista = () => {
    const location = useLocation()
    const perfilUsuarios = location.pathname.split('/')[3]
    const [ultimo, setUltimo] = useState()

    const fetchUsuarios = async (pagina, param) => {
        const res = await UsuarioService.listarPerfil(perfilUsuarios === 'alunos' ? 'aluno' : 'servidor', pagina, param, 'id, username, email', ultimo)
        
        setUltimo(res.data.results[res.data.results.length - 1])

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
            visualizar={false}
            editar={true}
        />
    )
}

export default UsuarioLista