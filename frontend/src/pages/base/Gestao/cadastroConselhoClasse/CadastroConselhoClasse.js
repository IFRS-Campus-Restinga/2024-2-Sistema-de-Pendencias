import "./CadastroConselhoClasse.css";
import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import Input from "../../../../components/Input/Input";
import { conselhoDeClasseService } from "../../../../services/conselhoDeClasse";


const CadastroConselhoClasse = () => {
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        data_reuniao: '',
        horario: '',
        total_alunos: '',
        alunos_reprovados: '',
        alunos_pendencia: '',
        alunos_ppt: '',
        observacoes: '',
        ata: ''
      });
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = formData;
        if (Object.keys(validationErrors).length === 0) {
          setShowErrorMessage(false);
          try {
            const response = await conselhoDeClasseService.create(formData)
    
            if (response.status !== 201) throw new Error(response.error)
            // Limpar o formulário após o sucesso
            setFormData({
                data_reuniao: '',
                horario: '',
                total_alunos: '',
                alunos_reprovados: '',
                alunos_pendencia: '',
                alunos_ppt: '',
                observacoes: '',
                ata: ''
            });
    
    
            setErrors({}); // Limpar os erros também
    
            // Mostrar toast de sucesso
            toast.success("Registro realizado com sucesso!", {
              position: "bottom-center",
              autoClose: 3000,
              style: { backgroundColor: '#28A745', color: '#fff' },
              progressStyle: { backgroundColor: '#fff' }
            });
          } catch (error) {
            console.error('Erro ao cadastrar conselho!', error);
    
              // Toast de erro
              toast.error("Falha na operação. Tente novamente.", {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#d11c28', color: '#fff' },
                progressStyle: { backgroundColor: '#fff' }
              });
            }
        } else {
          setErrors(validationErrors);
          setShowErrorMessage(true);
        }
      };
  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro de Conselho de Classe" comprimento="60%">
        <br />
        <div className="divCadastroConselho">
          <label htmlFor="date" className="labelCadastroConselho">
            Data da reunião
          </label>
          <span className="spanCadastroConselho">
            <Input type="date" textoAjuda="Ex.: 05/01/2025" />
          </span>
        </div>
        <div className="divCadastroConselho">
          <label htmlFor="hour" className="labelCadastroConselho">
            Horário
          </label>
          <span className="spanCadastroConselho">
            <Input type="text" textoAjuda="Ex.: 13h00" />
          </span>
        </div>
        <div className="divCadastroConselho">
          <label htmlFor="number" className="labelCadastroConselho">
            Total de alunos
          </label>
          <span className="spanCadastroConselho">
            <Input type="number" textoAjuda="Ex.: 10" />
          </span>
        </div>
        <div className="divCadastroConselho">
          <label htmlFor="number" className="labelCadastroConselho">
            Alunos aprovados
          </label>
          <span className="spanCadastroConselho">
            <Input type="number" textoAjuda="Ex.: 10" />
          </span>
        </div>
        <div className="divCadastroConselho">
          <label htmlFor="number" className="labelCadastroConselho">
            Alunos reprovados
          </label>
          <span className="spanCadastroConselho">
            <Input type="number" textoAjuda="Ex.: 50" />
          </span>
        </div>
        <div className="divCadastroConselho">
          <label htmlFor="number" className="labelCadastroConselho">
            Alunos em pendencia
          </label>
          <span className="spanCadastroAluno">
            <Input type="number" textoAjuda="Ex.: 32" />
          </span>
        </div>
        <div className="divCadastroConselho">
          <label htmlFor="number" className="labelCadastroConselho">
            Alunos PPT
          </label>
          <span className="spanCadastroConselho">
            <Input type="number" textoAjuda="Ex.: 07" />
          </span>
        </div>
        <div className="divCadastroConselho">
          <label htmlFor="text" className="labelCadastroConselho">
            Observações
          </label>
          <span className="spanCadastroConselho">
          <textarea
            className="textAreaCadastroConselho"
            name="observacoes"
            placeholder="Caso haja alguma observação sobre o conselho, insira aqui"
            maxLength={500}
          />
          </span>
        </div>
        <div className="divCadastroConselho">
          <label htmlFor="text" className="labelCadastroConselho">
            ATA
          </label>
          <span className="spanCadastroConselho">
          <textarea
            className="textAreaATA"
            name="ATA"
            placeholder="insira aqui"
            minLength={10}
            maxLength={50000}
          />
          </span>
        </div>

        <div className="ajuste-button"></div>
        <Button tipo="submit" text="Cadastrar" />
      </FormContainer>
    </>
  );
};

export default CadastroConselhoClasse;
