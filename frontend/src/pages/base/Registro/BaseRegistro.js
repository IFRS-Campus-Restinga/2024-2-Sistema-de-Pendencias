import { useNavigate } from 'react-router-dom'
import './BaseRegistro.css'
import { validaUsuario } from '../validaUsuario'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const BaseRegistro = () => {
    const redirect = useNavigate()
    const homeUrl = `/sessao/RegistroEscolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}`

    const validaRegistro = () => {
        const res = validaUsuario('RegistroEscolar')

        if (!res.status) {
            if (res.grupo === undefined) redirect('/')
            else redirect(`/sessao/${res.grupo}/${res.idUsuario}`)
        }
    }

    useEffect(() => {
        validaRegistro()
    }, [])

    return (
        <>
        </>
    )
}

export default BaseRegistro