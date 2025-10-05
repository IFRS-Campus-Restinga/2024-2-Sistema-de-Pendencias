import { useLocation } from "react-router-dom"
import Listagem from "../../../../features/listagem/Listagem"
import { PEDService } from "../../../../services/pedService"

const propMap = {
    'id': 'id',
    'aluno': 'aluno',
    'professor_disciplina': 'professor disciplina',
    'professor_ped': 'professor progressão',
    'curso': 'curso',
    'disciplina': 'disciplina',
    'trimestre_recuperar': 'trimestre(s) à recup.',
    'data_inicio': 'data início',
    'data_fim': 'data fim',
    'status': 'status',
    'situacao': 'situação'
}

const ListarPEDGestao = () => {
    const location = useLocation()
    const modalidade = location.pathname.split('/')[4]

    const fetchPEDs = async (pagina, param) => {
        const res = await PEDService.listar(
            'id, aluno, professor_ped, professor_disciplina, curso, disciplina, trimestre_recuperar, data_inicio, data_fim, status, situacao', 
            param, 
            pagina, 
            modalidade,
            'flat'
        )

        return {
            proxima: res.data.next,
            anterior: res.data.prev,
            lista: res.data.results
        }
    }

    return (
        <Listagem
            fetchDados={fetchPEDs}
            titulo={`PEDs ${modalidade}`}
            urlCadastro={'/session/gestao_escolar/peds/cadastro/'}
            propMap={propMap}
            editar={true}
            visualizar={true}
        />
    )
}

export default ListarPEDGestao