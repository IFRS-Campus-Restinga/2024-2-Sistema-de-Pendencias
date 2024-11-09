import './FormContainer.css'

const FormContainer = ({children, onSubmit, titulo, comprimento}) => {
    return (
        <form className="formContainer" onSubmit={onSubmit} style={{width: comprimento}}>
            <span className='tituloForm'>{titulo}</span>
            <hr className='linha'/>
            {/* aqui os inputs são renderizados */}
            {children}
        </form>
    )
}

export default FormContainer