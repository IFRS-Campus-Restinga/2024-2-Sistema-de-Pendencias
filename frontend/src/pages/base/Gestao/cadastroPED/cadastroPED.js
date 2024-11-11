import React, { useEffect, useState, useRef } from "react";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer"; // Importe o FormContainer
import Switch from '../../../../components/Switch/Switch'
import { ToastContainer, toast } from 'react-toastify'
import "./cadastroPED.css";
import cursoService from "../../../../services/cursoService";
import { validarFormularioPED } from "./validacoes";
import { usuarioBaseService } from "../../../../services/usuarioBaseService";
import { PED_EMIService } from "../../../../services/PED_EMIService";
import { PED_PROEJAService } from "../../../../services/PED_PROEJAService";

const CadastroPED = () => {
  const formRef = useRef()
  const [modalidade, setModalidade] = useState('Integrado')
  const [cursos, setCursos] = useState([])
  const [disciplinas, setDisciplinas] = useState([])
  const [opcoesAlunos, setOpcoesAlunos] = useState([])
  const [opcoesProfessores, setOpcoesProfessores] = useState([])
  const [turmas, setTurmas] = useState([])
  const [formData, setFormData] = useState({
    aluno: "",
    professor: "",
    curso: "",
    disciplina: "",
    dataInicio: new Date().toLocaleDateString('en-CA'),
    observacoes: "",
    trimestreRec: "",
  });
  const [errors, setErrors] = useState({});

  const trocaModalidade = (novoValor) => {
    setModalidade(novoValor);

    if (novoValor === 'Integrado') {
      setFormData({
        aluno: "",
        professor: "",
        curso: "",
        disciplina: "",
        dataInicio: new Date().toLocaleDateString('en-CA'),
        observacoes: "",
        turmaOrigem: "",
        serieAnoProgressao: "",
        trimestreRec: ""
      })
    } else {
      setFormData({
        aluno: "",
        professor: "",
        curso: "",
        disciplina: "",
        dataInicio: new Date().toLocaleDateString('en-CA'),
        observacoes: "",
        anoSemestreReprov: ""
      })
    }

    setErrors({})

  };

  const serieAnoProgressao = ['1º Ano', '2º Ano','3º Ano','4º Ano']

  const handleTrimestreRec = (e) => {
    const { checked, value } = e.target;
    let newTrimestreRec = formData.trimestreRec.split(', '); // Divide a string atual em um array

    if (checked) {
        // Se o checkbox foi marcado, adiciona o valor à lista, caso não exista
        if (!newTrimestreRec.includes(value)) {
            newTrimestreRec.push(value);
        }
    } else {
        // Se o checkbox foi desmarcado, remove o valor da lista
        newTrimestreRec = newTrimestreRec.filter(item => item !== value);
    }

    // Remove valores vazios e qualquer item indesejado (strings vazias ou espaços extras)
    newTrimestreRec = newTrimestreRec.filter(item => item.trim() !== '');

    // Ordena em ordem alfabética
    newTrimestreRec.sort();

    // Atualiza o estado com a string concatenada e sem vírgulas extras
    setFormData({
        ...formData,
        trimestreRec: newTrimestreRec.join(', '), // Concatena os valores novamente em uma string
    });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erros = validarFormularioPED(formData, modalidade)

    if (Object.keys(erros).length !== 0) {
      setErrors(erros)
    } else {
      try {
        if (modalidade === 'Integrado') {
          const res = await PED_EMIService.create(formData)

          if (res.status !== 201) throw new Error(res.data.message)          
        } else {
          const res = await PED_PROEJAService.create(formData)

          if (res.status !== 201) throw new Error(res.data.message)
        }
      
        toast.success("Dependência cadastrada com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' }
        });

        setFormData({
          aluno: '',
          curso: '',
          dataInicio: new Date().toLocaleDateString('en-CA'),
          disciplina: '',
          observacoes: '',
          professor: '',
          turmaOrigem: '',
          serieAnoProgressao: '',
          trimestreRec: ''
        })

        setErrors({})

      } catch (error) {
        console.error('Erro ao cadastrar dependência: ', error)
      }
    }
  };

  const fetchCursos = async () => {
    try {
      const res = await cursoService.list()

      const cursosPorModalidade = res.data.filter((curso) => curso.modalidade === modalidade)

      setCursos(cursosPorModalidade)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchAlunos = async (e) => {
    try {
      const res = await usuarioBaseService.buscarPorParametro(e.target.value, 'Aluno')

      setOpcoesAlunos(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProfessores = async (e) => {
    try {
      const res = await usuarioBaseService.buscarPorParametro(e.target.value, 'Professor')

      setOpcoesProfessores(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCursos()
  }, [modalidade])

  return (
    <>
      <ToastContainer/>
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro PED">
        {Object.keys(errors).length === 0 ? (<></>) : (<p style={{color: 'red'}}>*Preencha os campos obrigatórios</p>)}
        <span className="spanCadastroPED">
          <p className="pCadastroPED"> 
            Modalidade
          </p>
            <Switch valor1='ProEJA' valor2='Integrado' valor={modalidade} stateHandler={trocaModalidade}/>
        </span>
        {
          modalidade === 'Integrado' ? (
            <>
              <section className="sectionCadastroPED">
                <div className="divCadastroPED">
                  <label className="labelCadastroPED">
                    Aluno
                      <Input
                        tipo='text'
                        nome='aluno'
                        onChange={(e) => {
                          fetchAlunos(e)
                          
                          if (opcoesAlunos) {
                            const param = e.target.value
                            console.log(e.target.value)

                            const aluno = opcoesAlunos.find((aluno) => param === aluno.nome || aluno.infos_aluno.matricula || aluno.email)

                            if (aluno) setFormData({...formData, aluno: aluno.id})
                          }

                        }}
                        erro={errors.aluno}
                        textoAjuda='Insira nome ou matrícula do aluno'
                        lista={'opcoesAlunos'}
                      />
                    </label>
                    <datalist className="datalistCadastroPED" id="opcoesAlunos">
                      {
                        opcoesAlunos ? (opcoesAlunos.map((aluno) => (
                          <option className="optionCadastroPED" 
                            value={aluno.nome || aluno.infos_aluno.matricula || aluno.email}>
                              {aluno.nome || aluno.infos_aluno.matricula || aluno.email}
                          </option>
                        ))) : (<option>Nenhum aluno encontrado</option>)
                      }
                    </datalist>
                  <label className="labelCadastroPED">
                    Professor 
                    <Input
                      tipo='text'
                      nome='professor'
                      onChange={(e) => {
                        fetchProfessores(e)
                        
                        if (opcoesProfessores) {
                          const param = e.target.value
                          console.log(e.target.value)

                          const professor = opcoesProfessores.find((professor) => param === professor.nome || professor.email)

                          if (professor) setFormData({...formData, professor: professor.id})
                        }
                      }}
                      erro={errors.professor}
                      textoAjuda='Insira o email ou nome do professor'
                      lista={'opcoesProfessores'}
                    />
                  </label>
                  <datalist className="datalistCadastroPED" id="opcoesProfessores">
                    {
                      opcoesProfessores ? (opcoesProfessores.map((professor) => (
                        <option className="optionCadastroPED"
                          value={professor.nome || professor.email}>
                            {professor.nome || professor.email}
                        </option>
                      ))) : (<></>)
                    }
                  </datalist>
                </div>
                    <div className="divCadastroPED">
                      <label className="labelCadastroPED">
                        Trimestres a Recuperar
                        {errors.trimestreRec ? <p style={{color: 'red', fontSize: '10px'}}>{errors.trimestreRec}</p> : (<></>)}
                        <div className="divTrimestreRec">
                          <input className="checkboxTrimestre" onChange={handleTrimestreRec} type="checkbox" value='1º' id="1" hidden/>
                          <label className="labelTrimestreRec" htmlFor="1">1º Trimestre</label>
                          <input className="checkboxTrimestre" onChange={handleTrimestreRec} type="checkbox" value='2º' id="2" hidden/>
                          <label className="labelTrimestreRec" htmlFor="2">2º Trimestre</label>
                          <input className="checkboxTrimestre" onChange={handleTrimestreRec} type="checkbox" value='3º' id='3' hidden/>
                          <label className="labelTrimestreRec" htmlFor="3">3º Trimestre</label>
                        </div>
                      </label>
                    </div>
              </section>
              <section className="sectionCadastroPED">
                <div className="divCadastroPED">
                  <label className="labelCadastroPED">
                    Curso 
                    <select className={errors.curso ? 'errorSelectCadastroPED' : 'selectCadastroPED'} name="curso" onChange={(e) => {        
                        setFormData({...formData, curso: Number(e.target.value)})

                        const cursoId = e.target.value;
                    
                        const curso = cursos.find(curso => curso.id === Number(cursoId)); // Encontra o curso correspondente
                    
                        if (curso) {
                          setDisciplinas(curso.disciplinas);
                          setTurmas(curso.turmas);
                        }
                      }
                    }>
                      <option className="optionCadastroPED" value=''>Selecione um curso</option>
                      {
                        cursos.map((curso, index) => (
                          <option className="optionCadastroPED" value={curso.id} id={index}>{curso.nome}</option>
                        ))
                      }
                    </select>
                    {errors.curso ? <p style={{color: 'red', fontSize: '10px'}}>{errors.curso}</p> : (<></>)}
                  </label>
                  <label className="labelCadastroPED">
                    Disciplina 
                    <select className={errors.disciplina ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                      onChange={(e) => setFormData({...formData, disciplina: Number(e.target.value)})}
                    >
                      <option className="optionCadastroPED" value=''>Selecione uma disciplina</option>
                      {
                        disciplinas.map((disciplina) => (
                          <option className="optionCadastroPED" value={disciplina.id}>{disciplina.nome}</option>
                        ))
                      }
                    </select>
                    {errors.disciplina ? <p style={{color: 'red', fontSize: '10px'}}>{errors.disciplina}</p> : (<></>)}
                  </label>
                </div>
                <div className="divCadastroPED">
                  <label className="labelCadastroPED">
                    Turma do Estudante
                    <select className={errors.turmaOrigem ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                      onChange={(e) => setFormData({...formData, turmaOrigem: Number(e.target.value)})}
                    >
                      <option className="optionCadastroPED" value=''>Selecione uma turma</option>
                      {
                        turmas.map((turma) => (
                          <option className="optionCadastroPED" value={turma.id}>{turma.numero}</option>
                        ))
                      }
                    </select>
                    {errors.turmaOrigem ? <p style={{color: 'red', fontSize: '10px'}}>{errors.turmaOrigem}</p> : (<></>)}
                  </label>
                  <label className="labelCadastroPED">
                    Série/Ano da Progressão
                    <select className={errors.serieAnoProgressao ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                      onChange={(e) => setFormData({...formData, serieAnoProgressao: e.target.value})}
                    >
                      <option className="optionCadastroPED" value=''>Selecione uma turma</option>
                      {
                        serieAnoProgressao.map((serie) => (
                          <option className="optionCadastroPED" value={serie}>{serie}</option>
                        ))
                      }
                    </select>
                    {errors.serieAnoProgressao ? <p style={{color: 'red', fontSize: '10px'}}>{errors.serieAnoProgressao}</p> : (<></>)}
                  </label>
                </div>
              </section>
            </>
          ) : (
            <>
              <label className="labelCadastroPED">
                Aluno
                  <Input
                    tipo='text'
                    nome='aluno'
                    onChange={(e) => {
                      fetchAlunos(e)
                      
                      if (opcoesAlunos) {
                        const param = e.target.value
                        console.log(e.target.value)

                        const aluno = opcoesAlunos.find((aluno) => param === aluno.nome || aluno.infos_aluno.matricula || aluno.email)

                        if (aluno) setFormData({...formData, aluno: aluno.id})
                      }

                    }}
                    erro={errors.aluno}
                    textoAjuda='Insira nome ou matrícula do aluno'
                    lista={'opcoesAlunos'}
                  />
              </label>
              <datalist className="datalistCadastroPED" id="opcoesAlunos">
                {
                  opcoesAlunos ? (opcoesAlunos.map((aluno) => (
                    <option className="optionCadastroPED" 
                      value={aluno.nome || aluno.infos_aluno.matricula || aluno.email}>
                        {aluno.nome || aluno.infos_aluno.matricula || aluno.email}
                    </option>
                  ))) : (<option>Nenhum aluno encontrado</option>)
                }
              </datalist>
              <label className="labelCadastroPED">
                Professor 
                <Input
                  tipo='text'
                  nome='professor'
                  onChange={(e) => {
                    fetchProfessores(e)
                    
                    if (opcoesProfessores) {
                      const param = e.target.value
                      console.log(e.target.value)

                      const professor = opcoesProfessores.find((professor) => param === professor.nome || professor.email)

                      if (professor) setFormData({...formData, professor: professor.id})
                    }
                  }}
                  erro={errors.professor}
                  textoAjuda='Insira o email ou nome do professor'
                  lista={'opcoesProfessores'}
                />
              </label>
              <datalist className="datalistCadastroPED" id="opcoesProfessores">
                {
                  opcoesProfessores ? (opcoesProfessores.map((professor) => (
                    <option className="optionCadastroPED"
                      value={professor.nome || professor.email}>
                        {professor.nome || professor.email}
                    </option>
                  ))) : (<></>)
                }
              </datalist>
              <label className="labelCadastroPED">
                Curso 
                <select className={errors.curso ? 'errorSelectCadastroPED' : 'selectCadastroPED'} name="curso" onChange={(e) => {        
                    setFormData({...formData, curso: Number(e.target.value)})

                    const cursoId = e.target.value;
                
                    const curso = cursos.find(curso => curso.id === Number(cursoId)); // Encontra o curso correspondente
                
                    if (curso) {
                      setDisciplinas(curso.disciplinas);
                      setTurmas(curso.turmas);
                    }
                  }
                }>
                  <option className="optionCadastroPED" value=''>Selecione um curso</option>
                  {
                    cursos.map((curso, index) => (
                      <option className="optionCadastroPED" value={curso.id} id={index}>{curso.nome}</option>
                    ))
                  }
                </select>
              </label>
              <label className="labelCadastroPED">
                Disciplina 
                <select className={errors.disciplina ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                  onChange={(e) => setFormData({...formData, disciplina: Number(e.target.value)})}
                >
                  <option className="optionCadastroPED" value=''>Selecione uma disciplina</option>
                  {
                    disciplinas.map((disciplina) => (
                      <option className="optionCadastroPED" value={disciplina.id}>{disciplina.nome}</option>
                    ))
                  }
                </select>
              </label>
                <label className="labelCadastroPED">
                  Ano e Semestre de Reprovação
                  <Input
                    tipo='text'
                    onChange={(e) => {setFormData({...formData, anoSemestreReprov: e.target.value})}}
                    erro={errors.anoSemestreReprov}
                    textoAjuda='Insira o ano e semestre de reprovação no formato xxxx/x'
                  />
                  {errors.anoSemestreReprov ? <p style={{color: 'red', fontSize: '10px'}}>{errors.anoSemestreReprov}</p> : (<></>)}
                </label>
            </>
          )
        }
        <label className="labelCadastroPED">
          Observações (opcional)
          <textarea
            className="textAreaCadastroPED"
            onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
            name="observacoes"
            value={formData.observacoes}
            placeholder="Caso haja alguma observação sobre o aluno, insira aqui"
          />
        </label>
        <Button color="#006b3f" text="Cadastrar" tipo="submit" />
      </FormContainer>
    </>
  );
};

export default CadastroPED;
