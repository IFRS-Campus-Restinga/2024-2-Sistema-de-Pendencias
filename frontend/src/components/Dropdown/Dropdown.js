import React, { useState } from 'react';
import './Dropdown.css';
import { Link, useNavigate } from 'react-router-dom';

const Dropdown = ({ titulo, icone, itens, tipo, alinhar }) => {
  const redirect = useNavigate()
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
      <>
        {icone && titulo ? (
            <button
              className="dropdown-cabecalho"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {icone}
              <span className='dropdown-titulo'>{titulo}</span>
            {aberto && (
              <div
                className="dropdown-conteudo"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                >
                {itens.map((item, index) => (
                    <button className="dropdown-item" disabled={item.desabilitado} onClick={() => redirect(item.link)}>
                      {item.name}
                    </button>
                ))}
              </div>
            )}
          </button>
        ) : tipo === 'usuario' ? (
            <button 
             onMouseEnter={handleMouseEnter}
             onMouseLeave={handleMouseLeave}
             className='dropdown-cabecalho-usuario'
            >{icone}
            {aberto && (
              <div
                className="dropdown-conteudo-usuario"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                >
                {itens.map((item, index) => (
                  item.link ? (
                    <Link key={index} to={item.link} className="link">
                      <div className="dropdown-item-usuario">{item.name}</div>
                    </Link>
                  ) : (
                    <div className="dropdown-item-usuario" onClick={item.onClick}>{item.name}</div>
                  )
                ))
              }
              </div>
            )}
            </button>
        ) : tipo === 'icone' ? (
            <button 
             onMouseEnter={handleMouseEnter}
             onMouseLeave={handleMouseLeave}
             className='dropdown-cabecalho-icone'
            >{icone}
            {aberto && (
              <div
                className="dropdown-conteudo-icone"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                >
                {itens.map((item, index) => (
                  <button className="dropdown-item" disabled={item.desabilitado} onClick={() => redirect(item.link)}>
                    {item.name}
                  </button>
                ))
              }
              </div>
            )}
            </button>
        ) : (<></>)}
      </>
  );
};

export default Dropdown;
