import { Link, Outlet, useNavigate } from 'react-router-dom'
import './BaseProfessor.css'
import { validaUsuario } from '../validaUsuario'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import PageContainer from '../../../components/PageContainer/PageContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faHouse } from '@fortawesome/free-solid-svg-icons'
import Dropdown from '../../../components/Dropdown/Dropdown'

const BaseProfessor = () => {
    const redirect = useNavigate()
    const homeUrl = `/sessao/${jwtDecode(sessionStorage.getItem('token')).grupo}/${jwtDecode(sessionStorage.getItem('token')).idUsuario}`

    const validaProfessor = () => {
        const res = validaUsuario('Professor')

        if (!res.status) {
            if (res.grupo === undefined) redirect('/')
            else redirect(`/sessao/${res.grupo}/${res.idUsuario}`)
        }
    }

    useEffect(() => {
        validaProfessor()
    }, [])

    return (
        <PageContainer homeUrl={homeUrl}>
            <nav className='navBarProfessor'>
                <div className='itemContainer'>
                    <div className='navItemContainer'>
                        <Link to={homeUrl}>
                        <FontAwesomeIcon icon={faHouse} color='black' size='xl'/>
                        <span className='navTexto'>
                            Início
                        </span>
                        </Link>
                    </div>
                    <div className='navItemContainer'>
                        <Dropdown
                            icone={<FontAwesomeIcon icon={faBook} color='black' size='xl'/>}
                            titulo={'Dependencias'}
                            itens={[
                                {
                                    name: 'Minhas PEDs - EMI',
                                    link: `${homeUrl}/peds-emi`
                                },
                                {
                                    name: 'Minhas PEDs - ProEJA',
                                    link: `${homeUrl}/peds-proeja`
                                },
                            ]}
                        />
                    </div>
                </div>
            </nav>
            <Outlet/>
        </PageContainer>

    )
}

export default BaseProfessor