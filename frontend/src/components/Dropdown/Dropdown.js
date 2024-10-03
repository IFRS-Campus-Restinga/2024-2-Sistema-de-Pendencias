import React, { useState } from 'react';
import './Dropdown.css'; // Estilização do dropdown
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Dropdown = ({ titulo, itens }) => {
  const [aberto, setAberto] = useState(false);

  const alternarDropdown = () => {
    setAberto(!aberto);
  };

  return (
    <div className="dropdown">
      <button className="dropdown-titulo" onClick={alternarDropdown}>
        {titulo}
        <FontAwesomeIcon icon={aberto ? faChevronUp : faChevronDown} className="icone-flecha" />
      </button>
      {aberto && (
        <div className="dropdown-conteudo">
          {itens.map((item, index) => (
            <div key={index} className="dropdown-item">
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
