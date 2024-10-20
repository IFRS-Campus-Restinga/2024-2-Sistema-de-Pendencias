import React, { useState } from 'react';
import './Dropdown.css';
import { Link } from 'react-router-dom';

const Dropdown = ({ titulo, itens }) => {
  const [aberto, setAberto] = useState(false);
  let timeoutId; // Variável para armazenar o timeout

  const handleMouseEnter = () => {
    clearTimeout(timeoutId); // Cancela o timeout se o mouse voltar ao dropdown ou botão
    setAberto(true); // Mostra o dropdown
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setAberto(false); // Oculta o dropdown após o tempo definido
    }, 300); // 300ms de atraso
  };

  return (
    <div 
      className="navItemContainer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="dropdown-titulo">{titulo}</button>
      {aberto && (
        <div 
          className="dropdown-conteudo"
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave} 
        >
          {itens.map((item, index) => (
            <Link key={index} to={item.link} className="link">
              <div className="dropdown-item">{item.name}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
