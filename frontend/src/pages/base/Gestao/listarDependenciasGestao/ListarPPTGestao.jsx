import Listagem from "../../../../features/listagem/Listagem"
import { PPTService } from "../../../../services/pptService"

const propMap = {
    'id': 'id',
    'aluno': 'aluno',
    'professor_disciplina': 'professor disciplina',
    'professor_ppt': 'professor progressão',
    'curso': 'curso',
    'turma_atual': 'turma atual',
    'turma_progressao': 'turma progressão',
    'data_criacao': 'data criação',
    'disciplina': 'disciplina',
    'status': 'status',
    'situacao': 'situação'
}

const ListarPPTGestao = () => {
    const fetchPPTs = async (filtro, pagina, cursor) => {
        const res = await PPTService.listar(
            `
                id,
                aluno,
                professor_disciplina,
                professor_ppt,
                curso,
                disciplina,
                turma_atual,
                turma_progressao,
                data_criacao,
                status,
                situacao
            `, 
            filtro, 
            pagina,
            'flat',
            cursor
        )

        return {
            proxima: res.data.next,
            anterior: res.data.prev,
            resultados: res.data.results
        }
    }

    return (
        <Listagem
            fetchDados={fetchPPTs}
            titulo={'PPTs'}
            propMap={propMap}
            urlCadastro={'/session/gestao_escolar/ppts/cadastro/'}
            visualizar={true}
            editar={false}
        />
    )
}

export default ListarPPTGestao