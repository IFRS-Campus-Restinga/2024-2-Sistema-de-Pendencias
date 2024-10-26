import './FormContainer.css'

const FormContainer = ({children, onSubmit, titulo}) => {
    return (
        <form className="formContainer" onSubmit={onSubmit}>
            <span className='tituloForm'>{titulo}</span>
            <hr className='linha'/>
            {/* aqui os inputs são renderizados */}
            {children}
        </form>
    )
}

export default FormContainer