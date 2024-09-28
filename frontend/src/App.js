import React from 'react';
import Button from './components/Button/Button';

const App = () => {
  return (
    <div>
      <h1>Meu App</h1>
      <Button 
        text="Cadastrar" 
        onClick={() => alert('Botão clicado!')} 
      />
    </div>
  );
};

export default App;
