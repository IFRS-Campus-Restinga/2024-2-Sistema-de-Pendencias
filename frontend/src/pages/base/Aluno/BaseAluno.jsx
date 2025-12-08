import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { validaUsuario } from '../validaUsuario'
import PageContainer from '../../../components/PageContainer/PageContainer'
import { jwtDecode } from 'jwt-decode'

const BaseAluno = () => {
    const redirect = useNavigate()
    const homeUrl = `/session/${JSON.parse(sessionStorage.getItem('user')).group}/`

    const validaAluno = () => {
        const res = validaUsuario('aluno')

        if (!res.status) {
            if (res.grupo === undefined) redirect('/')
            else redirect(`/session/${res.grupo}/`)
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