import React from "react";
import Button from "./components/Button/Button";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./../src/App.css";

const App = () => {
  return (
    <div className="app">
      <Header greeting="Voce ainda nao se identificou." titleButton="(Acessar)" showBellIcon={false}/>
       {/* OU*/}
       {/*  <Header greeting="Bem vindo," title="Gestao Escolar." titleButton="Sair" showBellIcon={true}/>*/}
      <main>
        <div id="test">
          <Button text="Cadastrar" onClick={() => alert("Botão clicado!")} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
