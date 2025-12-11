import { useFetcher, useLocation } from "react-router-dom"
import Listagem from "../../../../features/listagem/Listagem"
import { PEDService } from "../../../../services/pedService"
import { useEffect, useState } from "react"

const ListarPEDGestao = () => {
    const location = useLocation()
    const modalidade = location.pathname.split('/')[4]
    const [propMap, setPropMap] = useState({})

    const getPropMap = () => {
        if (modalidade === 'Integrado') setPropMap({
            'id': 'id',
            'aluno': 'aluno',
            'professor_disciplina': 'professor disciplina',
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
            'curso': 'curso',
            'disciplina': 'disciplina',
            'ano_semestre_reprov': 'semestre de reprovação',
            'data_inicio': 'data início',
            'data_final': 'data fim',
            'status': 'status',
            'situacao': 'situação'
        })
    }

    const getFormat = () => {
        if (modalidade === 'Integrado') return 'id, aluno, professor_disciplina, curso, disciplina, trimestre_recuperar, data_inicio, data_final, status, situacao'
        
        if (modalidade === "ProEJA") return 'id, aluno, professor_disciplina, curso, disciplina, ano_semestre_reprov, data_inicio, data_final, status, situacao'
    }

    const fetchPEDs = async (pagina, param) => {
        const format = getFormat()

        const res = await PEDService.listarProfessor(
            format,
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

    useEffect(() => {
        getPropMap()
    }, [modalidade])

    return (
        <Listagem
            fetchDados={fetchPEDs}
            titulo={`PEDs ${modalidade}`}
            propMap={propMap}
            visualizar={true}
        />
    )
}

export default ListarPEDGestao