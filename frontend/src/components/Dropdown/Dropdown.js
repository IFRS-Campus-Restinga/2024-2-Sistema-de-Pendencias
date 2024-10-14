import React, { useState } from 'react';
import './Dropdown.css'; // Estilização do dropdown
import { Link } from 'react-router-dom';

const Dropdown = ({ titulo, itens }) => {
  const [aberto, setAberto] = useState(false);

  const alternarDropdown = () => {
    setAberto(!aberto);
  };

  return (
    <div className="dropdown">
      <button className="dropdown-titulo" onMouseEnter={alternarDropdown}>
        {titulo}
      </button>
      {aberto && (
        <div className="dropdown-conteudo" onMouseLeave={alternarDropdown}>
          {itens.map((item, index) => (
            <Link to={item.link} className='link'>
              <div key={index} className="dropdown-item">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
