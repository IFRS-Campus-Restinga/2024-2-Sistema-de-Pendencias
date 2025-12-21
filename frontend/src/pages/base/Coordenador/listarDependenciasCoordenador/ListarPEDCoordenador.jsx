import { useLocation } from "react-router-dom"
import Listagem from "../../../../features/listagem/Listagem"
import { PEDService } from "../../../../services/pedService"
import { useEffect, useState } from "react"

const ListarPEDCoordenador = () => {
    const location = useLocation()
    const modalidade = location.pathname.split('/')[4]
    const [propMap, setPropMap] = useState({})

    const getPropMap = () => {
        if (modalidade === 'Integrado') setPropMap({
            'id': 'id',
            'aluno': 'aluno',
            'professor_disciplina': 'professor disciplina',
            'professor_ped': 'professor progressão',
            'curso': 'curso',
            'disciplina': 'disciplina',
            'trimestre_recuperar': 'trimestre(s) à recup.',
            'data_inicio': 'data início',
            'data_final': 'data fim',
            'status': 'status',
            'situacao': 'situação'
        })
        
        if (modalidade === "ProEJA") setPropMap({
            'id': 'id',
            'aluno': 'aluno',
            'professor_disciplina': 'professor disciplina',
            'professor_ped': 'professor progressão',
            'curso': 'curso',
            'disciplina': 'disciplina',
            'ano_semestre_reprov': 'semestre de reprovação',
            'data_inicio': 'data início',
            'data_final': 'data fim',
            'data_criacao': 'data criação',
            'status': 'status',
            'situacao': 'situação'
        })
    }

    const getFormat = () => {
        if (modalidade === 'Integrado') return 'id, aluno, professor_ped, professor_disciplina, curso, disciplina, trimestre_recuperar, data_inicio, data_final, data_criacao, status, situacao'
        
        if (modalidade === "ProEJA") return 'id, aluno, professor_ped, professor_disciplina, curso, disciplina, ano_semestre_reprov, data_inicio, data_final, data_criacao, status, situacao'
    }

    const fetchPEDs = async (pagina, param, cursor) => {
        const format = getFormat()

        const res = await PEDService.listarCoordenador(
            format,
            param, 
            pagina, 
            modalidade,
            'flat',
            cursor
        )

        return {
            proxima: res.data.next,
            anterior: res.data.prev,
            resultados: res.data.results
        }
    }

    useEffect(() => {
        getPropMap()
    }, [modalidade])

    return (
        <Listagem
            fetchDados={fetchPEDs}
            titulo={`PEDs ${modalidade}`}
            propMap={propMap}
            editar={false}
            visualizar={true}
        />
    )
}

export default ListarPEDCoordenador