import { Outlet } from "react-router-dom";
import PageContainer from "../../components/PageContainer/PageContainer";
import testeService from "../../services/testeService";
import MainContainer from "../../components/MainContainer/mainContainer";
import { useEffect, useState } from "react";

const HomeAutentic = ({ usuario }) => {
  // const [usuario, setUsuario] = useState({});
  // useEffect(() => {
  //   setUsuario(usuario);
  // });

  const envioHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const mensagem = formData.get("teste").toString();

    const params = { mensagem };

    const res = await testeService.create(params);

    if (res.status === 200)
      alert(`A mensagem enviada ao servidor foi: "${res.data.mensagem}"`);

    alert("Algo deu errado!");
  };

  return (
    <PageContainer usuario={usuario}>
      <MainContainer>
        {/* <h3>FORM TESTE</h3>
        <form onSubmit={envioHandler}>
          <input
            type="text"
            name="teste"
            onChange={(e) => {
              e.value = e.target.value;
            }}
          />
          <button type="submit">ENVIAR</button>
        </form> */}
        <Outlet />
      </MainContainer>
      {/* Conteúdo da Home depois de autenticado */}
    </PageContainer>
  );
};

export default HomeAutentic;
