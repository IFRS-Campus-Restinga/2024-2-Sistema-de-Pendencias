import { useEffect } from 'react'
import './BaseAluno.css'
import { Outlet, useNavigate } from 'react-router-dom'
import { validaUsuario } from '../validaUsuario'
import PageContainer from '../../../components/PageContainer/PageContainer'
import MainContainer from '../../../components/MainContainer/mainContainer'
import { jwtDecode } from 'jwt-decode'

const BaseAluno = () => {
    const redirect = useNavigate()
    const homeUrl = `/sessao/Aluno/${jwtDecode(sessionStorage.getItem('token')).idUsuario}`

    const validaAluno = () => {
        const res = validaUsuario('Aluno')

        if (!res.status) {
            if (res.perfil === undefined) redirect('/')
            else redirect(`/sessao/${res.perfil}/${res.idUsuario}`)
        }
    }

    useEffect(() => {
        validaAluno()
    },[])

    return (
        <PageContainer homeUrl={homeUrl}>
            <Outlet/>
        </PageContainer>
    )
}

export default BaseAluno