// import React, { useEffect, useState } from "react";
// import Input from "../../../../components/Input/Input";
// import Button from "../../../../components/Button/Button";
// import FormContainer from "../../../../components/FormContainer/FormContainer";
// import { ToastContainer, toast } from 'react-toastify';
// import "./planoEstudos.css";  // Altere o nome do arquivo de estilo
// import { PlanoEstudosService } from "../../../../services/planoEstudosService";  // Crie o serviço para o plano de estudos
// import cursoService from "../../../../services/cursoService";
// import disciplinaService from "../../../../services/disciplinaService";
// //import formaOfertaService from "../../../../services/formaOfertaService";  // Serviço para formas de oferta
// //import turnoService from "../../../../services/turnoService";  // Serviço para turnos
// import { validarFormularioPlanoEstudos } from "./validacoes";  // Função de validação

/*
const CadastroPlanoEstudos = () => {
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [formasOferta, setFormasOferta] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [formData, setFormData] = useState({
    aluno: "",
    curso: "",
    disciplina: "",
    campus: "Default",  // O campus tem um valor default
    semestreAnoLetivo: "",
    componenteCurricular: "",
    semestreSerieCurso: "",
    trimestreRecuperar: "",
    formaOferta: "",
    turno: "",
    parecerPedagogico: "",
  });
  const [errors, setErrors] = useState({});

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const erros = validarFormularioPlanoEstudos(formData);

    if (Object.keys(erros).length !== 0) {
      setErrors(erros);
    } else {
      try {
        const res = await PlanoEstudosService.create(formData);
        if (res.status !== 201) throw new Error(res.response.data.mensagem);
        
        toast.success("Plano de Estudos Dirigidos cadastrado com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' }
        });

        setFormData({
          aluno: '',
          curso: '',
          disciplina: '',
          semestreAnoLetivo: '',
          componenteCurricular: '',
          semestreSerieCurso: '',
          trimestreRecuperar: '',
          formaOferta: '',
          turno: '',
          parecerPedagogico: ''
        });

        setErrors({});
      } catch (error) {
        console.error('Erro ao cadastrar o plano de estudos: ', error);
      }
    }
  };

  // Função para carregar os cursos
  const fetchCursos = async () => {
    try {
      const res = await cursoService.list();
      setCursos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Função para carregar as disciplinas de um curso
  const fetchDisciplinas = async (cursoId) => {
    try {
      const res = await disciplinaService.listByCurso(cursoId);
      setDisciplinas(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Função para carregar as formas de oferta
  const fetchFormasOferta = async () => {
    try {
      const res = await formaOfertaService.list();
      setFormasOferta(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Função para carregar os turnos
  const fetchTurnos = async () => {
    try {
      const res = await turnoService.list();
      setTurnos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCursos();
    fetchFormasOferta();
    fetchTurnos();
  }, []);

  // Função para atualizar os dados do formulário
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Função para selecionar o curso
  const handleCursoChange = (e) => {
    const cursoId = e.target.value;
    setFormData({ ...formData, curso: cursoId });
    fetchDisciplinas(cursoId);  // Atualiza as disciplinas ao selecionar um curso
  };

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro do Plano de Estudos Dirigidos">
        {Object.keys(errors).length === 0 ? null : (
          <p style={{ color: 'red' }}>*Preencha os campos obrigatórios</p>
        )}

        <label className="labelCadastroPlanoEstudos">
          Aluno
          <Input
            tipo="text"
            nome="aluno"
            onChange={handleInputChange}
            erro={errors.aluno}
            textoAjuda="Insira o nome ou matrícula do aluno"
          />
        </label>

        <label className="labelCadastroPlanoEstudos">
          Curso
          <select
            className={errors.curso ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
            name="curso"
            onChange={handleCursoChange}
          >
            <option value="">Selecione um curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="labelCadastroPlanoEstudos">
          Disciplina
          <select
            className={errors.disciplina ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
            name="disciplina"
            onChange={handleInputChange}
          >
            <option value="">Selecione uma disciplina</option>
            {disciplinas.map((disciplina) => (
              <option key={disciplina.id} value={disciplina.id}>
                {disciplina.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="labelCadastroPlanoEstudos">
          Semestre / Ano Letivo
          <Input
            tipo="text"
            nome="semestreAnoLetivo"
            onChange={handleInputChange}
            erro={errors.semestreAnoLetivo}
          />
        </label>

        <label className="labelCadastroPlanoEstudos">
          Componente Curricular
          <Input
            tipo="text"
            nome="componenteCurricular"
            onChange={handleInputChange}
            erro={errors.componenteCurricular}
          />
        </label>

        <label className="labelCadastroPlanoEstudos">
          Semestre / Série do Curso
          <Input
            tipo="text"
            nome="semestreSerieCurso"
            onChange={handleInputChange}
            erro={errors.semestreSerieCurso}
          />
        </label>

        <label className="labelCadastroPlanoEstudos">
          Trimestre de Recuperação
          <Input
            tipo="text"
            nome="trimestreRecuperar"
            onChange={handleInputChange}
            erro={errors.trimestreRecuperar}
          />
        </label>

        <label className="labelCadastroPlanoEstudos">
          Forma de Oferta
          <select
            className={errors.formaOferta ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
            name="formaOferta"
            onChange={handleInputChange}
          >
            <option value="">Selecione uma forma de oferta</option>
            {formasOferta.map((forma) => (
              <option key={forma.id} value={forma.id}>
                {forma.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="labelCadastroPlanoEstudos">
          Turno
          <select
            className={errors.turno ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
            name="turno"
            onChange={handleInputChange}
          >
            <option value="">Selecione um turno</option>
            {turnos.map((turno) => (
              <option key={turno.id} value={turno.id}>
                {turno.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="labelCadastroPlanoEstudos">
          Parecer Pedagógico
          <textarea
            className="textAreaCadastroPlanoEstudos"
            onChange={handleInputChange}
            name="parecerPedagogico"
            value={formData.parecerPedagogico}
            placeholder="Insira o parecer pedagógico aqui"
          />
        </label>

        <Button color="#006b3f" text="Cadastrar" tipo="submit" />
      </FormContainer>
    </>
  );
};

export default CadastroPlanoEstudos;*/
