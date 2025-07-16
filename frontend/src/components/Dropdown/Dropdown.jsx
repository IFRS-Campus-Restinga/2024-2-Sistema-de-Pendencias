import { Link } from "react-router-dom";
import styles from "./Dropdown.module.css";
import { useState } from "react";

const Dropdown = ({ itens, icone, img, titulo, elementos }) => {
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
          <h1 className={styles.titulo} onMouseEnter={changeDropdownState}>
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
        ) : null
      }
      {dropdownOpen ? (
        <ul className={styles.lista} onMouseLeave={changeDropdownState}>
          {itens.map((item) =>
            item.link ? (
              <Link to={item.link} className={styles.item}>
                <li>{item.titulo}</li>
              </Link>
            ) : (
              <li className={styles.item} onClick={item.onClick}>
                {item.titulo}
              </li>
            )
          )}
        </ul>
      ) : null}
    </div>
  );
};

export default Dropdown;
