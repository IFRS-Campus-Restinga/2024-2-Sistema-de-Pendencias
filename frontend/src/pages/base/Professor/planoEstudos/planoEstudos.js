import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import { ToastContainer, toast } from 'react-toastify';
import "./planoEstudos.css";
import { PlanoEstudosService } from "../../../../services/planoEstudosService";
import { validarFormularioPlanoEstudos } from "./validacoes";
import { PEDService } from "../../../../services/pedService";
import { useParams } from "react-router-dom";

const serieAnoProgressao = ['1º Ano', '2º Ano','3º Ano','4º Ano']

const Turnos = ['Manhã', 'Tarde', 'Noite', 'Integral'];

const FormaOferta = ['Presencial', 'EAD', 'Híbrido'];

const PlanoEstudos = () => {
  const {pedId} = useParams()
  const [PED, setPED] = useState({})
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [turmas, setTurmas] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erros = validarFormularioPlanoEstudos(formData);

    console.log(formData)

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
          trimestre_recuperar: '',
          forma_oferta: '',
          turno: '',
          parecer_pedagogico: '',
          ano_progressao: ''
        });

        setErrors({});
      } catch (error) {
        console.error('Erro ao cadastrar plano de estudos: ', error);
      }
    }
  };

  const handleTrimestreRec = (e) => {
    const { checked, value } = e.target;
    let newTrimestreRec = formData.trimestre_recuperar.split(', '); // Divide a string atual em um array

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
        trimestre_recuperar: newTrimestreRec.join(', '), // Concatena os valores novamente em uma string
    });
};

  const fecthPED = async () => {
    try {
      const res = await PEDService.porId(pedId)

      if (res.status!== 200) throw new Error(res.data.message)

      setPED(res.data)
      setTurmas(res.data.curso.turmas)

      console.log(res.data)

      if (res.data.modalidade) {
        setFormData({
          trimestre_recuperar: "",
          forma_oferta: "",
          serie_progressao: "",
          turno: "",
          parecer_pedagogico: "",
          ano_progressao: "",
          ped: res.data.id
        })
      } else if (res.data.modalidade) {
        setFormData({
          anoSemestreReprov: "",
          forma_oferta: "",
          turno: "",
          parecer_pedagogico: "",
          ped: res.data.id
        })
      }

      console.log(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fecthPED()
  },[])

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro Plano de Estudos">
        {Object.keys(errors).length === 0 ? (<></>) : (<p style={{ color: 'red' }}>*Preencha os campos obrigatórios</p>)}
        {
          PED.modalidade === 'Integrado' ? (
            <section className="sectionCadastroPlanoEstudos">
              <div className="divCadastroPlanoEstudos">
                <label className="labelCadastroPlanoEstudos">
                  Série
                  <select
                    className={errors.serie_progressao ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
                    onChange={(e) => setFormData({ ...formData, serie_progressao: e.target.value })}
                  >
                    <option value="">Selecione a série/ano da progressão</option>
                    {serieAnoProgressao.map((serie, index) => (
                      <option key={index} value={serie}>
                        {serie}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="labelCadastroPlanoEstudos">
                  Turma Origem
                  <select
                    className={errors.turma_origem ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
                    onChange={(e) => setFormData({ ...formData, turma_origem: e.target.value })}
                  >
                    <option value="">Selecione a turma de origem</option>
                    {turmas.map((turma, index) => (
                      <option key={index} value={turma.id}>
                        {turma.numero}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="divCadastroPED">
                  <label className="labelCadastroPED">
                    Trimestres a Recuperar
                    {errors.trimestre_recuperar ? <p style={{color: 'red', fontSize: '10px'}}>{errors.trimestre_recuperar}</p> : (<></>)}
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

              <div className="divCadastroPlanoEstudos">
                <label className="labelCadastroPlanoEstudos">
                  Forma de Oferta
                  <select
                    className={errors.forma_oferta ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
                    onChange={(e) => setFormData({ ...formData, forma_oferta: e.target.value })}
                  >
                    <option value="">Selecione a forma de oferta</option>
                    {FormaOferta.map((forma, index) => (
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
                    {Turnos.map((turno, index) => (
                      <option key={index} value={turno}>
                        {turno}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          ) : (
            <></>
          )
        }


        <section className="sectionCadastroPlanoEstudos">
          <div className="divCadastroPlanoEstudos">
            <label className="labelCadastroPlanoEstudos">
              Parecer Pedagógico
              <textarea
                className={errors.parecer_pedagogico ? 'errorTextAreaCadastroPlanoEstudos' : 'textAreaCadastroPlanoEstudos'}
                onChange={(e) => setFormData({ ...formData, parecer_pedagogico: e.target.value })}
                value={formData.parecer_pedagogico}
                rows="3"
              />
            </label>
          </div>
          <label className="labelCadastroPlanoEstudos">
                Ano Progressão
                <Input
                  type='text'
                  className={errors.ano_progressao ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
                  onChange={(e) => setFormData({ ...formData, ano_progressao: e.target.value })}
                />
              </label>
        </section>

        <Button tipo="submit" text='Cadastrar' />
      </FormContainer>
    </>
  );
};

export default PlanoEstudos;
