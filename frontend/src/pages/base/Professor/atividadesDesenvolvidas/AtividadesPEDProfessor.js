import { toast, ToastContainer } from "react-toastify";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../../../../components/Button/Button";
import AtividadesDependencia from "../../../../components/AtividadesDependencia/AtividadesDependencia";
import Input from "../../../../components/Input/Input";
import './AtividadesPEDProfessor.css'
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import atividadeService from "../../../../services/atividadeService";
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS";


const AtividadesPEDProfessor = () => {
  const location = useLocation()
  const {state} = location
  const modalidade = location.pathname.split('/')[5]
  const [atividades, setAtividades] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    avaliacoes: [],
  })

  const fetchAtividades = async () => {
    try { 
      const res = await Promise.all([
        atividadeService.listarPorProfessor(modalidade),
        atividadeService.listarPorPED(state.id, modalidade)
      ])

      if (res[0].status !== 200 || res[1].status !== 200) throw new Error(res)

      setFormData({avaliacoes: res[1].data})

      setAtividades(
        res[0].data.filter((atividade) => 
          !res[1].data.some((avaliacao) => avaliacao.atividade === atividade.id)
        )
      );

      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const vincularAtividade = (atividade) => {
    setFormData({
        ...formData,
        avaliacoes: [...formData.avaliacoes, { atividade: atividade.id, titulo: atividade.titulo }]
    });

    setAtividades(atividades.filter((a) => a.id !== atividade.id));
  };

  const desvincularAtividade = (avaliacao) => {
      setFormData({
          ...formData,
          avaliacoes: formData.avaliacoes.filter((a) => a.atividade !== avaliacao.atividade),
      });

      setAtividades([...atividades, {id: avaliacao.atividade, titulo: avaliacao.titulo}]);
  };

  const adicionarDataEntrega = (atividade, novaData) => {
    setFormData(prevState => ({
      ...prevState,
      avaliacoes: prevState.avaliacoes.map(avaliacao => 
        avaliacao.atividade === atividade 
          ? { ...avaliacao, data_entrega: novaData, ped: state.id }
          : avaliacao
      ),
    }));
  }

  const adicionarNota = (atividade, nota) => {
    setFormData(prevState => ({
      ...prevState,
      avaliacoes: prevState.avaliacoes.map(avaliacao => 
        avaliacao.atividade === atividade 
          ? { ...avaliacao, nota: nota }
          : avaliacao
      ),
    }));
  }

  const enviarAtividades = async (e) => {
    e.preventDefault()

    try {
      const res = await atividadeService.vincular(state.id, modalidade, formData)

      if (res.status !== 201) throw new Error(res)
      
      toast.success(
        "Plano de estudos atualizado com sucesso!",
        {
          position: "bottom-center",
          autoClose: 3000,
          style: {
            backgroundColor: "#28A745",
            color: "#fff",
            textAlign: "center",
          },
          progressStyle: { backgroundColor: "#fff" },
        }
      );
    } catch (error) {
      
    }
  }

  useEffect(() => {
    fetchAtividades()
  }, [])

  if (isLoading) return <LoadingIFRS/>

  return (
    <>
    <ToastContainer/>
      {
        state ? (
          <FormContainer titulo='Atividades da Dependência' onSubmit={enviarAtividades}>
            <section className="sectionAtividadesPEDProfessor">
              <div className="containerTabelaAtividadesPEDProfessor">
                <table>
                  <thead>
                      <tr>
                        <th>Minhas Atividades</th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                      atividades.map((atividade) => (
                          <tr style={{height: '35px'}}>
                          <td style={{height: '35px'}}>
                              <div className="divAtividadesPEDProfessor">
                                  <p className="pAtividadesPEDProfessor">{atividade.titulo}</p>
                                  <FontAwesomeIcon icon={faAnglesRight} onClick={() => vincularAtividade(atividade)}/>
                              </div>
                          </td>
                          </tr>
                      ))
                      }
                  </tbody>
                </table>
              </div>

              <div className="containerTabelaAtividadesPEDProfessor">
                  <table>
                  <thead>
                      <tr>
                        <th>Atividade</th>
                        <th>Data de Entrega</th>
                        <th>Nota</th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                      formData.avaliacoes.map((avaliacao) => (
                          <tr>
                              <td style={{width: '40%'}}>
                                <div className="divAtividadesPEDProfessor">
                                  <FontAwesomeIcon icon={faAnglesLeft} onClick={() => desvincularAtividade(avaliacao)} style={{position: 'fixed'}}/>
                                  <p className="pAtividadesPEDProfessor">{avaliacao.titulo}</p>
                                </div>
                              </td>
                              <td style={{width: '40%'}}>
                                <Input type={'date'} fonte={'10px'} dataMinima={new Date().toISOString().split("T")[0]} onChange={(e) => adicionarDataEntrega(avaliacao.atividade, e.target.value)} valor={avaliacao.data_entrega}/>
                              </td>
                              <td>
                                <Input type={'text'} fonte={'10px'} alinharCentro={true} onChange={(e) => adicionarNota(avaliacao.atividade, e.target.value)} valor={avaliacao.nota}/>
                              </td>
                          </tr>
                      ))
                      }
                  </tbody>
                  </table>
              </div>
            </section>
            <Button text={'Salvar Alterações'} tipo={'submit'}/>
          </FormContainer>
        ) : (
          <AtividadesDependencia editar={true} visualizar={true}/>
        )
      }
    </>
  )
};

export default AtividadesPEDProfessor;
