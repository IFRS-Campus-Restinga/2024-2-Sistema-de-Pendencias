import { useNavigate } from 'react-router-dom'
import { validaUsuario } from '../validaUsuario'
import './BaseCoordenador.css'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const BaseCoordenador = () => {
    const redirect = useNavigate()
    const homeUrl = `/sessao/Coordenador/${jwtDecode(sessionStorage.getItem('token')).idUsuario}`

    const validaCoordenador = () => {
        const res = validaUsuario('Registro')

        if (!res.status) {
            if (res.grupo === undefined) redirect('/')
            else redirect(`/sessao/${res.grupo}/${res.idUsuario}`)
        }
    }

    useEffect(() => {
        validaCoordenador()
    }, [])

    return (
        <>
        </>
    )
}

export default BaseCoordenador