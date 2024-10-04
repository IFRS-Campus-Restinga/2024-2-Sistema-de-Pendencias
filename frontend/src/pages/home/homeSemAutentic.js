import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BackButton from "../../components/BackButton/BackButton";
import Modal from "../../components/Modal/Modal";
import Dropdown from "../../components/Dropdown/Dropdown";
import Input from "../../components/Input/Input";
import "./homeSemAutentic.css";
import PageContainer from "../../components/PageContainer/PageContainer";

const HomeSemAutentic = () => {
  const [modalAberto, setModalAberto] = useState(false);

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const itensDropdown = ["Plano de estudos", "Atividades", "Finalização"];
  const handleBack = () => {
    // Lógica para voltar, como redirecionar ou fechar uma página
    alert("Voltando...");
  };
  return (
    <PageContainer>
      <Header usuario={false} />
      <main>
        <div id="back-button">
          <BackButton onClick={handleBack} />
        </div>

        <button onClick={abrirModal}>Abrir Modal</button>
        <Modal
          estaAberto={modalAberto}
          aoFechar={fecharModal}
          mensagem="Cadastro realizado com sucesso!"
        />

        <Input tipo="texto" />
        <Input tipo="numero" largura="300px" />
        <div id="dropdown">
          <Dropdown titulo="Editar" itens={itensDropdown} />
        </div>
      </main>
      <Footer />
    </PageContainer>
  );
};

export default HomeSemAutentic;
