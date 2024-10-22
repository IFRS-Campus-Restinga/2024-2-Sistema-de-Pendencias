import {jwtDecode} from 'jwt-decode'

export const validaUsuario = (perfilPagina) => {
    const token = sessionStorage.getItem('token')

    if (token === null || token === undefined) return {status: false}
    
    const decoded = jwtDecode(token)

    if (decoded.perfil !== perfilPagina) {
         return {
            status: false,
            perfil: decoded.perfil,
            idUsuario: decoded.idUsuario
        }
    } else {
        return {
            status: true
        }
    }
}