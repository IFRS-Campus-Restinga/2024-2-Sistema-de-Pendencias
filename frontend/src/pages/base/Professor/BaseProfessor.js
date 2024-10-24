import { useNavigate } from 'react-router-dom'
import './BaseProfessor.css'
import { validaUsuario } from '../validaUsuario'
import { useEffect } from 'react'

const BaseProfessor = () => {
    const redirect = useNavigate()

    const validaProfessor = () => {
        const res = validaUsuario('Registro')

        if (!res.status) {
            if (res.perfil === undefined) redirect('/')
            else redirect(`/sessao/${res.perfil}/${res.idUsuario}`)
        }
    }

    useEffect(() => {
        validaProfessor()
    }, [])

    return (
        <>
        </>
    )
}

export default BaseProfessor