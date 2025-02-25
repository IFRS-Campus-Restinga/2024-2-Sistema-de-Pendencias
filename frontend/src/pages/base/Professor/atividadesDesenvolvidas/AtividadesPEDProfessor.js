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
  const [media, setMedia] = useState(null)
  const [formData, setFormData] = useState({
    avaliacoes: [],
  })
  const [erros, setErros] = useState({
    avaliacoes: []
  })

  const calcularMedia = () => {
    if (formData.avaliacoes.length > 0) {
      if (formData.avaliacoes.every((avaliacao) => avaliacao.nota !== '' && !isNaN(avaliacao.nota) && avaliacao.nota !== null)) {
        let total = formData.avaliacoes.reduce((sum, avaliacao) => sum + parseFloat(avaliacao.nota), 0);
        setMedia((total / formData.avaliacoes.length).toFixed(2));
      } else {
        setMedia(null)
      }
    } else {
      setMedia(null);
    }
  };

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
    setFormData(prevState => ({
      ...prevState,
      avaliacoes: [...prevState.avaliacoes, { atividade: atividade.id, titulo: atividade.titulo }]
    }));
    
    setAtividades(atividades.filter((a) => a.id !== atividade.id));
  };

  const desvincularAtividade = (avaliacao) => {
    setFormData(prevState => ({
      ...prevState,
      avaliacoes: formData.avaliacoes.filter((a) => a.atividade !== avaliacao.atividade),
    }));

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
    setFormData(prevState => {
      return {
        ...prevState,
        avaliacoes: prevState.avaliacoes.map((avaliacao, index) => {
          if (avaliacao.atividade === atividade) {
            // Se a nota for vazia ou nula, adiciona um erro na mesma posição
            if (nota === '' || nota === null) {
              setErros(prevErros => {
                const novosErros = [...prevErros.avaliacoes];
                novosErros[index] = { ...novosErros[index], nota: "O campo nota não pode estar vazio caso a nota já tenha sido registrada" };
                return { ...prevErros, avaliacoes: novosErros };
              });
  
              return { ...avaliacao, nota }; // Retorna sem modificar a nota
            }
  
            // Remove o erro caso a nota seja válida
            setErros(prevErros => {
              const novosErros = [...prevErros.avaliacoes];
              novosErros[index] = { ...novosErros[index], nota: null };
              return { ...prevErros, avaliacoes: novosErros };
            });
  
            return { ...avaliacao, nota };
          }
          return avaliacao;
        })
      };
    });

  };
  
  const validarInputData = (index) => {
    setErros(prevErros => {
      const novosErros = [...prevErros.avaliacoes];
  
      if (!novosErros[index]) {
        novosErros[index] = {};
      } 
  
      if (!formData.avaliacoes[index]?.data_entrega) {
        novosErros[index].data_entrega = "A data é obrigatória";
      } else {
        novosErros[index].data_entrega = null;
      }
  
      return { ...prevErros, avaliacoes: novosErros };
    });
  };

  const validarForm = () => {
    const novosErros = [...erros.avaliacoes]
    let valido = true

    formData.avaliacoes.map((avaliacao, index) => {
      if (avaliacao.data_entrega === '' || avaliacao.data_entrega === undefined) {
          novosErros[index] = {...novosErros[index], data_entrega: 'O campo data deve possuir um valor'}
          valido = false
      } else {
        novosErros[index] = { ...novosErros[index], data_entrega: null }; // Limpa o erro se estiver válido
      }
    })

    setErros(prevErros => ({ ...prevErros, avaliacoes: novosErros }));

    return valido
  }
  
  const enviarAtividades = async (e) => {
    e.preventDefault()

    if (validarForm()) {
      try {
        const res = await atividadeService.vincular(state.id, modalidade, formData)
  
        if (res.status !== 201) throw new Error('A nota de uma atividade já avaliada não pode ser apagada')
        
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
        
        setErros({avaliacoes: []})
      } catch (error) {
        toast.error(
          error.message,
          {
            position: "bottom-center",
            autoClose: 3000,
            style: {
              backgroundColor: "#f00",
              color: "#fff",
              textAlign: "center",
            },
            progressStyle: { backgroundColor: "#fff" },
          }
        );

        setTimeout(() => {
          fetchAtividades()
        }, 3000);
      }
    }

  }

  useEffect(() => {
    fetchAtividades()
  }, [])

  useEffect(() => {
    calcularMedia()
  }, [formData.avaliacoes])

  if (isLoading) return <LoadingIFRS/>

  return (
    <>
    <ToastContainer/>
    <FormContainer titulo='Atividades da Dependência' onSubmit={enviarAtividades} textoInfo={'Clique nas setas para vincular/desvincular atividades ao plano da dependência\n\nCaso uma nota seja registrada no sistema, não poderá mais ser apagada, apenas substituída por outro valor'}>
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
                  atividades.length > 0 ? (
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
                  ) : (
                    <p style={{textAlign: 'center', marginTop: '15px', fontWeight: 600}}>Não existem atividades cadastradas para esta modalidade</p>
                  )
                }
            </tbody>
          </table>
        </div>

        <div className="containerTabelaAtividadesPEDProfessor">
            <table>
            <thead>
                <tr>
                  <th>Atividade</th>
                  <th>Data de Entrega*</th>
                  <th>Nota</th>
                </tr>
            </thead>
            <tbody>
                {
                formData.avaliacoes.map((avaliacao, index) => (
                    <tr>
                        <td style={{width: '40%'}}>
                          <div className="divAtividadesPEDProfessor">
                            <FontAwesomeIcon icon={faAnglesLeft} onClick={() => desvincularAtividade(avaliacao)} style={{position: 'fixed'}}/>
                            <p className="pAtividadesPEDProfessor">{avaliacao.titulo}</p>
                          </div>
                        </td>
                        <td style={{width: '40%'}}>
                          <Input type={'date'} fonte={'10px'} erro={erros?.avaliacoes[index]?.data_entrega} dataMinima={new Date().toISOString().split("T")[0]} onChange={(e) => adicionarDataEntrega(avaliacao.atividade, e.target.value)} onBlur={() => validarInputData(index)} valor={avaliacao.data_entrega}/>
                        </td>
                        <td>
                          <Input type={'text'} fonte={'10px'} erro={erros?.avaliacoes[index]?.nota} alinharCentro={true} onChange={(e) => adicionarNota(avaliacao.atividade, e.target.value)} valor={avaliacao.nota}/>
                        </td>
                    </tr>
                ))
                }
            </tbody>
            </table>
        </div>
      </section>
      <div className="divAtividadesPEDProfessor">
        <span className="spanAtividadesPEDProfessor">
          Média final: {
            media ? (
              <p className="pMedia">{media}</p>
            ) : (
              <p className="pMedia">
                A média final só estará disponível caso todas as atividades possuam nota.
              </p>
            )
          }
        </span>
      </div>
      <Button text={'Salvar Alterações'} tipo={'submit'}/>
    </FormContainer>
    </>
  )
};

export default AtividadesPEDProfessor;
