import { useEffect, useState } from 'react'
import './BaseAluno.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { validaUsuario } from '../validaUsuario'
import PageContainer from '../../../components/PageContainer/PageContainer'
import MainContainer from '../../../components/MainContainer/mainContainer'

const BaseAluno = () => {
    const redirect = useNavigate()
    const [homeUrl] = useState(useLocation().pathname)

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
            <MainContainer>
                <Outlet homeUrl={homeUrl}/>
            </MainContainer>
        </PageContainer>
    )
}

export default BaseAluno