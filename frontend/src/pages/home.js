import React, { useState } from "react";
import Button from "../components/Button/Button";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BackButton from "../components/BackButton/BackButton";
import Modal from "../components/Modal/Modal";
import Dropdown from "../components/Dropdown/Dropdown";
import Input from "../components/Input/Input";
import styles from "../home.module.css";

const Home = () => {
  const [modalAberto, setModalAberto] = useState(false);

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const itensDropdown = ["Plano de estudos", "Atividades", "Finalização"];
  const handleBack = () => {
    // Lógica para voltar, como redirecionar ou fechar uma página
    alert("Voltando...");
  };
  return (
    <div className="app">
      <Header
        greeting="Voce ainda nao se identificou."
        titleButton="(Acessar)"
        showBellIcon={false}
      />
      {/* OU*/}
      {/*  <Header greeting="Bem vindo," title="Gestao Escolar." titleButton="Sair" showBellIcon={true}/>*/}
      <main>
        <div id="test">
          <Button text="Cadastrar" onClick={() => alert("Botão clicado!")} />
        </div>
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
        <div id={styles.dropdown}>
          <Dropdown titulo="Editar" itens={itensDropdown} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
