import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import atividadeService from "../../services/atividadeService"
import FormContainer from "../FormContainer/FormContainer"
import Tabela from "../Tabela/Tabela"
import LoadingIFRS from "../LoadingIFRS/LoadingIFRS"
import Lupa from "../../assets/lupa-branca.png"; // Ajuste o caminho conforme necessário
import X from "../../assets/x-branco.png"; // Ajuste o caminho conforme necessário
import Input from "../Input/Input"
import Adicionar from '../../assets/icone-adicionar-curso.png'
import './AtividadesDependencia.css'
import { jwtDecode } from "jwt-decode"


const AtividadesDependencia = ({ editar, visualizar, atividades}) => {
    const navigate = useNavigate()
    const [atividadesFiltradas, setAtividadesFiltradas] = useState(atividades)
    const [filtroGeral, setFiltroGeral] = useState(null)

    const filtrarAtividades = () => {
        const atividadesFiltradas = atividadesFiltradas.filter(atividade => (
            atividade.titulo.toLowerCase().includes(filtroGeral.toLowerCase()) || 
            atividade.descricao.toLowerCase().includes(filtroGeral.toLowerCase()) ||
            atividade.carga_horaria === Number(filtroGeral)
        ));
        setAtividadesFiltradas(atividadesFiltradas);
    };

    const limparBusca = () => {
        setFiltroGeral('');
    };

    useEffect(() => {
        setAtividadesFiltradas(atividades)
    }, [atividades])

    return (
        <FormContainer titulo={'Minhas Atividades'}>
            <div className='divAtividadesDependencia'>
                <div className="containerBusca">
                    <Input
                    tipo='search'
                    valor={filtroGeral}
                    onChange={(e) => setFiltroGeral(e.target.value)}
                    textoAjuda={'Buscar'}
                    />
                    <img
                    className='iconesBuscarCurso'
                    src={Lupa}
                    onClick={filtrarAtividades}
                    title='Buscar'
                    />
                    <img
                    className='iconesBuscarCurso'
                    src={X}
                    onClick={limparBusca}
                    title='Limpar Busca'
                    />
                    </div>
                    <div className='adicionarCurso'>
                    <img
                    src={Adicionar}
                    className='iconeAdicionarCurso'
                    onClick={() => navigate(`/sessao/${jwtDecode(sessionStorage.getItem('token')).grupo}/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroAtividade`)}
                    title='Cadastrar Curso'
                    />
                </div>       
            </div>
            <Tabela editar={editar}  visualizar={visualizar} listaFiltrada={atividadesFiltradas}/> 
        </FormContainer>
    )

}

export default AtividadesDependencia