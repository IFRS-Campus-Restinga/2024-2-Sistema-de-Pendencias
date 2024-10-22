import './Switch.css'

const Switch = ({valor, stateHandler, valor1, valor2}) => {
    const handleClick = () => {
        // Alterna entre valor1 e valor2
        const novoValor = valor === valor1 ? valor2 : valor1;
        stateHandler(novoValor);
      };

    return (
        <button type='button' className={valor === valor1 ? 'button' : 'toggledBtn'} onClick={handleClick}>
            <p id='text' className={valor === valor1 ? 'btnText' : 'toggledBtnText'}>
                {valor === valor1 ? valor1 : valor2}
            </p>
            <div className={valor === valor1? 'slider' : 'toggledSlider'}>
            </div>
        </button>
    )
}

export default Switch