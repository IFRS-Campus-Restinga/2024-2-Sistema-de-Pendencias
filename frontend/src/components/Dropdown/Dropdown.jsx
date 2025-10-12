import { Link } from "react-router-dom";
import styles from "./Dropdown.module.css";
import { useEffect, useState } from "react";

const Dropdown = ({ itens, icone, img, titulo, elementos, fontSize }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const changeDropdownState = () => {
    if (dropdownOpen) {
      setTimeout(() => {
        setDropdownOpen((prev) => !prev);
      }, 300);
    } else {
      setDropdownOpen((prev) => !prev);
    }
  };

  return (
    <div className={styles.dropdownContainer}>
      {
        titulo ? (
          <h1 className={styles.titulo} style={{ "--dropdown-font-size": fontSize || "inherit" }} onMouseEnter={changeDropdownState}>
              {icone ? (
                <>
                  <img
                    className={styles.icone}
                    src={icone}
                    alt={titulo}
                  />
                  {titulo}
                </>
              ) : elementos ? (
                elementos
              ) : null}
            </h1>
        ) : img ? (
          <img
              className={styles.img}
              src={img}
              alt={titulo}
              onMouseEnter={changeDropdownState}
          />
        ) : icone ? (
          <div onMouseEnter={changeDropdownState}>
            {icone}
          </div>
        ) : null
      }
      {dropdownOpen ? (
        <ul className={styles.lista} onMouseLeave={changeDropdownState}>
          {itens.map((item) =>
            item.link ? (
              <Link 
                to={item.link}
                state={item.state} 
                className={item.desabilitado ? styles.desabilitado : styles.item}
              >
                <li className={styles.itemTitle} style={{ "--dropdown-font-size": fontSize || "inherit" }}>{item.name}</li>
              </Link>
            ) : (
              <li 
                onClick={item.onClick}
                className={item.desabilitado ? styles.desabilitado : styles.item}
              >
                <p className={styles.itemTitle} style={{ "--dropdown-font-size": fontSize || "inherit" }}>
                  {item.name}
                </p>
              </li>
            )
          )}
        </ul>
      ) : null}
    </div>
  );
};

export default Dropdown;
