import { useEffect, useState } from "react"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import Tabela from "../../../../components/Tabela/Tabela"
import { PEDService } from "../../../../services/pedService"
import Button from "../../../../components/Button/Button"
import Input from "../../../../components/Input/Input"



const ListarPEDEMI = () => {
    const [listaPED_EMI, setListaPED_EMI] = useState([])
    const [listaFiltrada, setListaFiltrada] = useState([])
    const [filtro, setFiltro] = useState({
        filtroGeral: '',
        dataInicio: '',
        dataFinal: '',
        status: '',
        situacao: ''
    })

    const fetchPED_EMI = async () => {
        try {
            const res = await PEDService.listaEMI()
            
            if (res.status !== 200) throw new Error(res)

            setListaPED_EMI(res.data)
            setListaFiltrada(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const filtrarPEDs = () => {
        console.log(filtro)
        const PEDsFiltradas = listaPED_EMI.filter(ped => 
            (!filtro.filtroGeral || 
              (ped.aluno && ped.aluno.toLowerCase().includes(filtro.filtroGeral.toLowerCase())) ||
              (ped.professor_ped && ped.professor_ped.toLowerCase().includes(filtro.filtroGeral.toLowerCase())) ||
              (ped.professor_disciplina && ped.professor_disciplina.toLowerCase().includes(filtro.filtroGeral.toLowerCase())) ||
              (ped.curso && ped.curso.toLowerCase().includes(filtro.filtroGeral.toLowerCase())) ||
              (ped.disciplina && ped.disciplina.toLowerCase().includes(filtro.filtroGeral.toLowerCase())) ||
              (ped.turma_origem && ped.turma_origem.toLowerCase().includes(filtro.filtroGeral.toLowerCase())) ||
              (ped.serie_progressao && ped.serie_progressao.toLowerCase().includes(filtro.filtroGeral.toLowerCase()))
            ) &&
            (!filtro.dataInicio || new Date(ped.data_inicio) >= new Date(filtro.dataInicio)) &&
            (!filtro.dataFinal || new Date(ped.data_final) <= new Date(filtro.dataFinal)) &&
            (!filtro.status || ped.status === filtro.status) &&
            (!filtro.situacao || ped.situacao === filtro.situacao)
          );

          console.log(PEDsFiltradas)
          setListaFiltrada(PEDsFiltradas);
    };

    const limparBusca = () => {
        setFiltro({
            filtroGeral: '',
            dataInicio: '',
            dataFinal: '',
            status: '',
            situacao: ''
        })
    }

    useEffect(() => {
        fetchPED_EMI()
    }, [filtro])
    return (
        <FormContainer titulo='Dependências - EMI' comprimento='95%'>
            <section className="sectionListarPEDGestao">
                <div className="divListarPEDGestao">
                    <label className="labelListarPEDGestao">
                        Buscar
                        <Input
                            textoAjuda={'Digite qualquer valor'}
                            onChange={(e) => {setFiltro({...filtro, filtroGeral: e.target.value})}}
                            valor={filtro.filtroGeral}
                        />
                    </label>
                    <label className="labelListarPEDGestao">
                        Status
                        <select className="selectListarPEDGestao" value={filtro.status} onChange={(e) => {
                            setFiltro({...filtro, status: e.target.value})
                        }}>
                            <option className="optionListarPEDGestao" value=''>Todos</option>
                            <option className="optionListarPEDGestao" value='Criada'>Criada</option>
                            <option className="optionListarPEDGestao" value='Plano de Estudos Elaborado'>Plano de Estudos Elaborado</option>
                            <option className="optionListarPEDGestao" value='Finalizada'>Finalizada</option>
                            <option className="optionListarPEDGestao" value='Desativado'>Desativado</option>
                        </select>
                    </label>
                    <label className="labelListarPEDGestao">
                        Situação
                        <select className="selectListarPEDGestao" value={filtro.situacao} onChange={(e) => {
                            setFiltro({...filtro, situacao: e.target.value})
                        }}>
                            <option className="optionListarPEDGestao" value=''>Todos</option>
                            <option className="optionListarPEDGestao" value='Aprovado'>Aprovado</option>
                            <option className="optionListarPEDGestao" value='Em Avaliação'>Em Avaliação</option>
                            <option className="optionListarPEDGestao" value='Reprovado'>Reprovado</option>
                        </select>
                    </label>
                </div>
                <div className="divListarPEDGestao">
                    <label className="labelListarPEDGestao">
                        Data Início
                        <Input
                            type='date'
                            onChange={(e) => {setFiltro({...filtro, dataInicio: e.target.value})}}
                        />
                    </label>
                    <label className="labelListarPEDGestao">
                        Data Final
                        <Input
                            type='date'
                            onChange={(e) => {setFiltro({...filtro, dataFinal: e.target.value})}}
                        />
                    </label>
                    <span className="spanListarPEDGestao">
                        <Button text='Buscar' onClick={filtrarPEDs}/>
                        <Button text='Limpar campos' onClick={limparBusca} color="#4A4A4A"/>
                    </span>
                </div>
            </section>
            <Tabela listaFiltrada={listaFiltrada} fontSize={'10px'}/>
        </FormContainer>
    )
}

export default ListarPEDEMI