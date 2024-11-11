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
import { PEDService } from "../../../../services/pedService";

const CadastroPED = () => {
  const formRef = useRef()
  const [modalidade, setModalidade] = useState('Integrado')
  const [cursos, setCursos] = useState([])
  const [disciplinas, setDisciplinas] = useState([])
  const [opcoesAlunos, setOpcoesAlunos] = useState([])
  const [opcoesProfessores, setOpcoesProfessores] = useState([])
  const [formData, setFormData] = useState({
    aluno: "",
    professor: "",
    curso: "",
    disciplina: "",
    modalidade: modalidade,
    dataInicio: new Date().toLocaleDateString('en-CA'),
    observacao: "",
  });
  const [errors, setErrors] = useState({});

  const trocaModalidade = (novoValor) => {
    setModalidade(novoValor);

    setFormData({
      aluno: "",
      professor: "",
      curso: "",
      disciplina: "",
      modalidade: novoValor,
      dataInicio: new Date().toLocaleDateString('en-CA'),
      observacao: "",
    })

    formRef.current.reset()

    setErrors({})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erros = validarFormularioPED(formData)

    if (Object.keys(erros).length !== 0) {
      setErrors(erros)
    } else {
      try {
        const res = await PEDService.create(formData)

        if (res.status !== 201) throw new Error(res.data.message)
      
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
          modalidade: modalidade,
          observacao: '',
          professor: '',
        })

        formRef.current.reset()

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
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro PED" ref={formRef}>
        {Object.keys(errors).length === 0 ? (<></>) : (<p style={{color: 'red'}}>*Preencha os campos obrigatórios</p>)}
        <span className="spanCadastroPED">
          <p className="pCadastroPED"> 
            Modalidade
          </p>
            <Switch valor1='ProEJA' valor2='Integrado' valor={modalidade} stateHandler={trocaModalidade}/>
        </span>
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

                const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)

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
        <label className="labelCadastroPED">
          Observações (opcional)
          <textarea
            className="textAreaCadastroPED"
            onChange={(e) => setFormData({...formData, observacao: e.target.value})}
            name="observacao"
            value={formData.observacao}
            placeholder="Caso haja alguma observação sobre o aluno, insira aqui"
          />
        </label>
        <Button color="#006b3f" text="Cadastrar" tipo="submit" />
      </FormContainer>
    </>
  );
};

export default CadastroPED;
