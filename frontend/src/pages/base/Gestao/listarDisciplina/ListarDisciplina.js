import { jwtDecode } from 'jwt-decode'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import Tabela from '../../../../components/Tabela/Tabela'
import { disciplinaService } from '../../../../services/disciplinaService'
import './ListarDisciplina.css'
import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../../../components/Input/Input'
import X from "../../../../assets/x-branco.png";
import Lupa from "../../../../assets/lupa-branca.png";
import Adicionar from "../../../../assets/icone-adicionar-disciplina.png";

const ListarDisciplina = () => {
    const navigate = useNavigate()
    const [disciplinas, setDisciplinas] = useState([])
    const [disciplinasFiltradas, setDisciplinasFiltradas] = useState([])
    const [filtroGeral, setFiltroGeral] = useState('')

    const filtrarDisciplinas = () => {
        const disciplinasFiltradas = disciplinas.filter((disciplina) => (
            !filtroGeral || disciplina.nome.toLowerCase().includes(filtroGeral.toLowerCase()) ||
            disciplina.carga_horaria === Number(filtroGeral) ||
            disciplina.cursos.toLowerCase().includes(filtroGeral.toLowerCase())
        ))

        setDisciplinasFiltradas(disciplinasFiltradas)
    }

    const fetchDisciplinas = async () => {
        try {
            const res = await disciplinaService.list()

            if (res.status !== 200) throw new Error(res)

            setDisciplinas(res.data)
            setDisciplinasFiltradas(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const limparBusca = async () => {
        setFiltroGeral('')

        setDisciplinasFiltradas(disciplinas)
    }

    useEffect(() => {
        fetchDisciplinas()
    },[])

    return (
        <FormContainer titulo='Lista de Disciplinas'>
            <div className='containerBuscarDisciplina'>
                <div class="buscaBarDisciplina">
                    <Input
                    tipo='search'
                    valor={filtroGeral}
                    onChange={(e) => setFiltroGeral(e.target.value)}
                    textoAjuda={'Buscar'}
                    />
                    <img
                    className='iconesBuscarDisciplina'
                    src={Lupa}
                    onClick={filtrarDisciplinas}
                    title='Buscar'
                    />
                    <img
                    className='iconesBuscarDisciplina'
                    src={X}
                    onClick={limparBusca}
                    title='Limpar Busca'
                    />
                </div>
                <div className='adicionarDisciplina'>
                    <img
                    className='iconeAdicionarDisciplina'
                    src={Adicionar}
                    onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroDisciplina`)}
                    title='Cadastrar Disciplina'
                    />
                </div>
            </div>
            <Tabela listaFiltrada={disciplinasFiltradas}/>
        </FormContainer>
    )
}

export default ListarDisciplina