import { useEffect, useState } from "react"
import { PEDService } from "../../../../../services/pedService"
import { jwtDecode } from "jwt-decode"
import FormContainer from "../../../../../components/FormContainer/FormContainer"
import './ListarPEDProfessor.css'


const ListarPEDProfessor = () => {
    const [PED, setPED] = useState([])

    const fetchPED = async () => {
        try {
            const res = await PEDService.listarPorProfessor(jwtDecode(sessionStorage.getItem('token')).idUsuario)

            if (res.status !== 200) throw new Error(res.data.message)

            setPED(res.data)
            console.log(res.data)
        } catch (error) {
            console.error('Erro ao buscar as PEDs', error)
        }
    }

    useEffect(() => {
        fetchPED()
    }, [])

    return (
        <FormContainer titulo='Minhas PEDs' comprimento='80%'>
            <div className="divListarPEDProfessor"></div>
            <div className="professorPEDContainer">
                <span className="cabecalhoPEDContainer">
                    <p className="colunaPEDContainer">Aluno</p>
                    <p className="colunaPEDContainer">Modalidade</p>
                    <p className="colunaPEDContainer">Curso</p>
                    <p className="colunaPEDContainer">Disciplina</p>
                    <p className="colunaPEDContainer">Situação</p>
                    <p className="colunaPEDContainer">Status</p>
                    <p className="colunaPEDContainer">Data de Criação</p>
                </span>
                <span className="corpoPEDContainer">
                    {
                        PED.map((ped) => (
                            <label className="linhaPEDContainer">
                                <p className="colunaPEDContainer">{ped.aluno.nome || ped.aluno.email}</p>
                                <p className="colunaPEDContainer">{ped.modalidade}</p>
                                <p className="colunaPEDContainer">{ped.curso.nome}</p>
                                <p className="colunaPEDContainer">{ped.disciplina.nome}</p>
                                <p className="colunaPEDContainer">{ped.situacao}</p>
                                <p className="colunaPEDContainer">{ped.status}</p>
                                <p className="colunaPEDContainer">{ped.dataInicio}</p>
                            </label>
                        ))
                    }
                </span>
            </div>
        </FormContainer>
    )
}

export default ListarPEDProfessor