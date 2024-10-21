import { useEffect, useState } from 'react'
import './BaseAluno.css'
import { useNavigate } from 'react-router-dom'
import { validaUsuario } from '../validaUsuario'

const BaseAluno = () => {
    const redirect = useNavigate()

    const validaAluno = () => {
        const res = validaUsuario('Registro')

        if (!res.status) {
            if (res.perfil === undefined) redirect('/')
            else redirect(`/sessao/${res.perfil}/${res.idUsuario}`)
        }
    }

    useEffect(() => {
        validaAluno()
    },[])

    return (
        <>
        </>
    )
}

export default BaseAluno