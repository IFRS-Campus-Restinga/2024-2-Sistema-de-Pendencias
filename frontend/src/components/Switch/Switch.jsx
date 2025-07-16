import styles from './Switch.module.css'

const Switch = ({valor, stateHandler, valor1, valor2, imagemCustom}) => {
    let handleClick = () => {
        // Alterna entre valor1 e valor2
        const novoValor = valor === valor1 ? valor2 : valor1;
        if (stateHandler) stateHandler(novoValor);
      };

    return (
        <button type='button' className={valor === valor1 ? styles.button : styles.toggledBtn} onClick={handleClick}>
            <p id={styles.text} className={valor === valor1 ? styles.btnText : styles.toggledBtnText}>
                {valor === valor1 ? valor1 : valor2}
            </p>
            <div className={valor === valor1? styles.slider : styles.toggledSlider}>
                {imagemCustom}
            </div>
        </button>
    )
}

export default Switch