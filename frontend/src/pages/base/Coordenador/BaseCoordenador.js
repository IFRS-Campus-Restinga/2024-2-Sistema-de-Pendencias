import { useNavigate } from 'react-router-dom'
import { validaUsuario } from '../validaUsuario'
import './BaseCoordenador.css'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Link, Outlet } from 'react-router-dom'
import PageContainer from '../../../components/PageContainer/PageContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faHouse } from '@fortawesome/free-solid-svg-icons'
import Dropdown from '../../../components/Dropdown/Dropdown'


const BaseCoordenador = () => {
    const redirect = useNavigate()
    const homeUrl = `/sessao/${jwtDecode(sessionStorage.getItem('token')).grupo}/${jwtDecode(sessionStorage.getItem('token')).idUsuario}`

    const validaCoordenador = () => {
        const res = validaUsuario('Coordenador')

        if (!res.status) {
            if (res.grupo === undefined) redirect('/')
            else redirect(`/sessao/${res.grupo}/${res.idUsuario}`)
        }
    }

    useEffect(() => {
        validaCoordenador()
    }, [])

    return (
        <PageContainer homeUrl={homeUrl}>
            <nav className='navBarCoordenador'>
                <div className='itemContainer'>
                    <div className='navItemContainer'>
                        <Link to={homeUrl}>
                            <FontAwesomeIcon icon={faHouse} color='black' size='xl' />
                            <span className='navTexto'>
                                Início
                            </span>
                        </Link>
                    </div>
                    <div className='navItemContainer'>
                        <Dropdown
                            icone={<FontAwesomeIcon icon={faBook} color='black' size='xl' />}
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
            <Outlet />
        </PageContainer>
    )
}

export default BaseCoordenador