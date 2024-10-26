import Button from '../Button/Button';
import './CalendarioContainer.css';

const CalendarioContainer = ({ children, onSubmit, titulo }) => {
    return (
        <form className="calendarioContainer" onSubmit={onSubmit}>
            <span className='tituloCalendario'>{titulo}</span>
            <hr/>
            {children}
            <div className='buttonContainer'>
                <Button
                    width="30%"
                    color="#006b3f"
                    text="Cadastrar Evento"
                    tipo='submit'
                />
            </div>
        </form>
    );
};

export default CalendarioContainer;
