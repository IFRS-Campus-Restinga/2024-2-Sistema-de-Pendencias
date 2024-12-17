import React, { useEffect, useState } from "react";
import "./ConselhoClasse.css";
import { conselhoDeClasseService } from "../../../../services/conselhoDeClasse";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import Modal from "../../../../components/Modal/Modal";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Tabela from "../../../../components/Tabela/Tabela";
import Adicionar from "../../../../assets/icone-adicionar-conselho.png";
import { jwtDecode } from "jwt-decode"; // Para decodificar o token e pegar o ID do usuário

const ConselhoClasse = () => {
  const [listaConselho, setListaConselho] = useState([]);
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const navigate = useNavigate();

  const fetchConselhos = async () => {
    try {
      const res = await conselhoDeClasseService.listarConselhoDeClasse(
        null,
        "lista"
      );

      if (res.status !== 200) throw new Error(res);

      setListaConselho(res.data);
      setListaFiltrada(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConselhos();
  }, []);

  return (
    <>
      <FormContainer titulo={`Conselho de Classe`} comprimento="80%">
        <div>
        <div className="adicionarConselho">
          <img
            className="iconeAdicionarConselho"
            src={Adicionar}
            onClick={() =>
              navigate(
                `/sessao/Gestão Escolar/${
                  jwtDecode(sessionStorage.getItem("token")).idUsuario
                }/cadastrarConselho`
              )
            }
            title="Cadastrar Conselho de Classe"
          />
        </div>
        <Tabela
          listaFiltrada={listaFiltrada}
          editar={true}
          visualizar={true}
          deletar={true}
        />
        </div>
      </FormContainer>
    </>
  );
};

export default ConselhoClasse;
