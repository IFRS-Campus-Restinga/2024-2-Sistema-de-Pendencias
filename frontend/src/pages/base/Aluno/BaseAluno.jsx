import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { validaUsuario } from '../validaUsuario'
import PageContainer from '../../../components/PageContainer/PageContainer'

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