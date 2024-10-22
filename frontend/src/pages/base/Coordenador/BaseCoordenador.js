import { useNavigate } from 'react-router-dom'
import { validaUsuario } from '../validaUsuario'
import './BaseCoordenador.css'
import { useEffect } from 'react'

const BaseCoordenador = () => {
    const redirect = useNavigate()

    const validaCoordenador = () => {
        const res = validaUsuario('Registro')

        if (!res.status) {
            if (res.perfil === undefined) redirect('/')
            else redirect(`/sessao/${res.perfil}/${res.idUsuario}`)
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