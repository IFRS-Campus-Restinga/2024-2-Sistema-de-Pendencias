import React from "react";
import Button from "./components/Button/Button";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./../src/App.css";

const App = () => {
  return (
    <div className="app">
      <Header />
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
