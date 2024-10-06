// Objeto ENV que contém as variáveis de ambiente utilizadas na aplicação.
const ENV = {
    // ID do cliente OAuth2 do Google, obtido a partir das variáveis de ambiente.
    REACT_APP_GOOGLE_OAUTH2_CLIENT_ID: process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID,
    
    // URL base da aplicação, obtida a partir das variáveis de ambiente.
    BASE_APP_URL: process.env.REACT_APP_BASE_APP_URL,
    
    // URL base da API, obtida a partir das variáveis de ambiente.
    BASE_API_URL: process.env.REACT_APP_BASE_API_URL
};

// Exporta o objeto ENV para que possa ser utilizado em outras partes da aplicação.
export default ENV;
