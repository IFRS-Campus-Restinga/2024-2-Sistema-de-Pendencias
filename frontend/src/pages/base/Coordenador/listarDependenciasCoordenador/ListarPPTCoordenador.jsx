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
    'disciplina': 'disciplina',
    'status': 'status',
    'data_criacao': 'data criação',
    'situacao': 'situação'
}

const ListarPPTCoordenador = () => {
    const fetchPPTs = async (filtro, pagina, cursor) => {
        const res = await PPTService.listarCoordenador(
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
            pagina, 
            'flat',
            filtro,
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
            visualizar={true}
            editar={false}
            comprimento={'85%'}
        />
    )
}

export default ListarPPTCoordenador