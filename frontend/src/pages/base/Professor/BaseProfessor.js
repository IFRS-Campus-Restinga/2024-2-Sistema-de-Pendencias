import { Outlet, useNavigate } from 'react-router-dom'
import './BaseProfessor.css'
import { validaUsuario } from '../validaUsuario'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import PageContainer from '../../../components/PageContainer/PageContainer'

const BaseProfessor = () => {
    const redirect = useNavigate()
    const homeUrl = `/sessao/Professor/${jwtDecode(sessionStorage.getItem('token')).idUsuario}`

    const validaProfessor = () => {
        const res = validaUsuario('Professor')

        if (!res.status) {
            if (res.perfil === undefined) redirect('/')
            else redirect(`/sessao/${res.perfil}/${res.idUsuario}`)
        }
    }

    useEffect(() => {
        validaProfessor()
    }, [])

    return (
        <PageContainer homeUrl={homeUrl}>
            <Outlet/>
        </PageContainer>

    )
}

export default BaseProfessor