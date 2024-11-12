import {jwtDecode} from 'jwt-decode'

export const validaUsuario = (grupoPagina) => {
    const token = sessionStorage.getItem('token')

    if (token === null || token === undefined) return {status: false}
    
    const decoded = jwtDecode(token)

    if (decoded.grupo !== grupoPagina) {
         return {
            status: false,
            grupo: decoded.grupo,
            idUsuario: decoded.idUsuario
        }
    } else {
        return {
            status: true
        }
    }
}