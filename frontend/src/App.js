import React from "react";
import Button from "./components/Button/Button";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import BackButton from "./components/BackButton/BackButton";
import "./../src/App.css";

const App = () => {
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
      </main>
      <Footer />
    </div>
  );
};

export default App;
