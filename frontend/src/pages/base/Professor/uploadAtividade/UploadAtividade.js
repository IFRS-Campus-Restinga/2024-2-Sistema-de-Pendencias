import React, { useState } from "react";
import * as XLSX from 'xlsx';
import "./UploadAtividade.css";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import {ToastContainer, toast} from 'react-toastify'

function UploadAtividade() {
  const [dados, setDados] = useState([]);
  const [error, setError] = useState("");
  const [arquivo, setArquivo] = useState(null);

  const [formData, setFormData] = useState({
    título: "",
    descrição: "",
    nota: "",
    data_entrega:"",
    observações: ""
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setArquivo(file);

    if (file && file.name.endsWith(".xlsx")) {
      setError("");
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const requiredColumns = ["Título", "Descrição", "Nota", "Data de Entrega", "Observações"];
        const fileColumns = jsonData[0];

        const hasRequiredColumns = requiredColumns.every(col => fileColumns.includes(col));

        if (hasRequiredColumns) {
          setDados(jsonData);
        } else {
          setError("O arquivo deve conter as colunas: Título, Descrição, Nota, Data de Entrega e Observações");
          setArquivo(null);
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      setError("Arquivo errado");
    }
  };

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!arquivo) {
      setError("Selecione um arquivo");
      return;
    }

    const formData = new FormData();
    formData.append("arquivo", arquivo);

    fetch("/upload-atividades", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Arquivo enviado com sucesso", {
            position: "bottom-center",
            autoClose: 3000,
            style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
            progressStyle: { backgroundColor: '#fff' }
        });
      })
      .catch((error) => {
        console.error("Erro ao enviar arquivo:", error);
        toast.error("Erro ao enviar arquivo", {
            position: "bottom-center",
            autoClose: 3000,
            style: { backgroundColor: '#d11c28', color: '#fff', textAlign: 'center' },
            progressStyle: { backgroundColor: '#fff' }
        });
      });
  };

  return (
    <>
     <ToastContainer/>
      <FormContainer titulo={"Faça o upload de atividades no formato de EXCEL"}>
        <div className="containerInput">
          <input type="file" accept=".xlsx" className="inputFile" onChange={handleFileUpload} />
          {error && <p className="error">{error}</p>}
          <Button tipo="button" text="Enviar" className="buttonUpload" onClick={handleEnviar} />
        </div>
      </FormContainer>
    </>
  );
}

export default UploadAtividade;