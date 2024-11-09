import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer"; // Importe o FormContainer
import { ToastContainer, toast } from 'react-toastify';
import "./planoEstudos.css";
import { PlanoEstudosService } from "../../../../services/planoEstudosService";
import cursoService from "../../../../services/cursoService";
import { validarFormularioPlanoEstudos } from "./validacoes";
import { usuarioBaseService } from "../../../../services/usuarioBaseService";

const PlanoEstudos = () => {
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [opcoesAlunos, setOpcoesAlunos] = useState([]);
  const [formasOferta, setFormasOferta] = useState(["Presencial", "EAD", "Semipresencial"]); // Exemplos de opções
  const [turnos, setTurnos] = useState(["Manhã", "Tarde", "Noite"]); // Exemplos de turnos
  const [formData, setFormData] = useState({
    aluno: "",
    curso: "",
    disciplina: "",
    semestreAnoLetivo: "",
    componenteCurricular: "",
    semestreCurso: "",
    trimestreRecuperacao: "",
    formaOferta: "",
    turno: "",
    parecerPedagogico: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erros = validarFormularioPlanoEstudos(formData);

    if (Object.keys(erros).length !== 0) {
      setErrors(erros);
    } else {
      try {
        const res = await PlanoEstudosService.create(formData);

        if (res.status !== 201) throw new Error(res.response.data.mensagem);

        toast.success("Plano de estudos cadastrado com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' },
        });

        setFormData({
          aluno: '',
          curso: '',
          disciplina: '',
          semestreAnoLetivo: '',
          componenteCurricular: '',
          semestreCurso: '',
          trimestreRecuperacao: '',
          formaOferta: '',
          turno: '',
          parecerPedagogico: ''
        });

        setErrors({});
      } catch (error) {
        console.error('Erro ao cadastrar plano de estudos: ', error);
      }
    }
  };

  const fetchCursos = async () => {
    try {
      const res = await cursoService.list();
      setCursos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAlunos = async (e) => {
    try {
      const res = await usuarioBaseService.buscarPorParametro(e.target.value, 'Aluno');
      setOpcoesAlunos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro Plano de Estudos">
        {Object.keys(errors).length === 0 ? (<></>) : (<p style={{ color: 'red' }}>*Preencha os campos obrigatórios</p>)}

        <label className="labelCadastroPlanoEstudos">
          Aluno
          <Input
            tipo="text"
            nome="aluno"
            onChange={(e) => {
              fetchAlunos(e);
              if (opcoesAlunos) {
                const param = e.target.value;
                const aluno = opcoesAlunos.find((aluno) => param === aluno.nome || aluno.matricula || aluno.email);
                if (aluno) setFormData({ ...formData, aluno: aluno.id });
              }
            }}
            erro={errors.aluno}
            textoAjuda="Insira nome ou matrícula do aluno"
            lista="opcoesAlunos"
          />
        </label>
        <datalist id="opcoesAlunos">
          {opcoesAlunos ? (
            opcoesAlunos.map((aluno) => (
              <option key={aluno.id} value={aluno.nome || aluno.matricula || aluno.email}>
                {aluno.nome || aluno.matricula || aluno.email}
              </option>
            ))
          ) : (
            <option>Nenhum aluno encontrado</option>
          )}
        </datalist>

        <section className="sectionCadastroPlanoEstudos">
          <div className="divCadastroPlanoEstudos">
            <label className="labelCadastroPlanoEstudos">
              Curso
              <select
                className={errors.curso ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
                name="curso"
                onChange={(e) => {
                  setFormData({ ...formData, curso: Number(e.target.value) });

                  const cursoId = e.target.value;
                  const curso = cursos.find((curso) => curso.id === Number(cursoId));
                  if (curso) {
                    setDisciplinas(curso.disciplinas);
                  }
                }}
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
                onChange={(e) => setFormData({ ...formData, disciplina: Number(e.target.value) })}
              >
                <option value="">Selecione uma disciplina</option>
                {disciplinas.map((disciplina) => (
                  <option key={disciplina.id} value={disciplina.id}>
                    {disciplina.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="divCadastroPlanoEstudos">
            <label className="labelCadastroPlanoEstudos">
              Semestre / Ano Letivo
              <Input
                tipo="text"
                nome="semestreAnoLetivo"
                onChange={(e) => setFormData({ ...formData, semestreAnoLetivo: e.target.value })}
                erro={errors.semestreAnoLetivo}
              />
            </label>

            <label className="labelCadastroPlanoEstudos">
              Componente Curricular
              <Input
                tipo="text"
                nome="componenteCurricular"
                onChange={(e) => setFormData({ ...formData, componenteCurricular: e.target.value })}
                erro={errors.componenteCurricular}
              />
            </label>
          </div>
        </section>

        <section className="sectionCadastroPlanoEstudos">
          <div className="divCadastroPlanoEstudos">
            <label className="labelCadastroPlanoEstudos">
              Semestre / Série do Curso
              <Input
                tipo="text"
                nome="semestreCurso"
                onChange={(e) => setFormData({ ...formData, semestreCurso: e.target.value })}
                erro={errors.semestreCurso}
              />
            </label>

            <label className="labelCadastroPlanoEstudos">
              Trimestre de Recuperação
              <Input
                tipo="text"
                nome="trimestreRecuperacao"
                onChange={(e) => setFormData({ ...formData, trimestreRecuperacao: e.target.value })}
                erro={errors.trimestreRecuperacao}
              />
            </label>
          </div>

          <div className="divCadastroPlanoEstudos">
            <label className="labelCadastroPlanoEstudos">
              Forma de Oferta
              <select
                className={errors.formaOferta ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
                onChange={(e) => setFormData({ ...formData, formaOferta: e.target.value })}
              >
                <option value="">Selecione a forma de oferta</option>
                {formasOferta.map((forma, index) => (
                  <option key={index} value={forma}>
                    {forma}
                  </option>
                ))}
              </select>
            </label>

            <label className="labelCadastroPlanoEstudos">
              Turno
              <select
                className={errors.turno ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
                onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
              >
                <option value="">Selecione o turno</option>
                {turnos.map((turno, index) => (
                  <option key={index} value={turno}>
                    {turno}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="sectionCadastroPlanoEstudos">
          <div className="divCadastroPlanoEstudos">
            <label className="labelCadastroPlanoEstudos">
              Parecer Pedagógico
              <textarea
                className={errors.parecerPedagogico ? 'errorTextAreaCadastroPlanoEstudos' : 'textAreaCadastroPlanoEstudos'}
                onChange={(e) => setFormData({ ...formData, parecerPedagogico: e.target.value })}
                value={formData.parecerPedagogico}
                rows="3"
              />
            </label>
          </div>
        </section>

        <Button tipo="submit" texto="Cadastrar" />
      </FormContainer>
    </>
  );
};

export default PlanoEstudos;
