import { useNavigate } from 'react-router-dom'
import './BaseRegistro.css'
import { validaUsuario } from '../validaUsuario'
import { useEffect } from 'react'

const BaseRegistro = () => {
    const redirect = useNavigate()

    const validaRegistro = () => {
        const res = validaUsuario('Registro')

        if (!res.status) {
            if (res.perfil === undefined) redirect('/')
            else redirect(`/sessao/${res.perfil}/${res.idUsuario}`)
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