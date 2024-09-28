import React from "react";
import Button from "./components/Button/Button";
import Header from "./components/Header/Header";
import "./../src/App.css"

const App = () => {
  return (
    <div>
      <Header />
      <div id="test">
        <Button text="Cadastrar" onClick={() => alert("Botão clicado!")} />
      </div>
    </div>
  );
};

export default App;
