import Button from '../Button/Button'
import './FormContainer.css'

const FormContainer = ({children, onSubmit, titulo}) => {
    return (
        <form className="formContainer" onSubmit={onSubmit}>
            <span className='tituloForm'>{titulo}</span>
            <hr/>
            {/* aqui os inputs são renderizados */}
            {children}
            <div className='buttonContainer'>
                <Button
                width="30%"
                color="#006b3f"
                text="Cadastrar"
                tipo='submit'
            />   
            </div>
        </form>
    )
}

export default FormContainer