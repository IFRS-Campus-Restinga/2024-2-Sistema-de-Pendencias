import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID}>
      <RouterProvider router={router}/>
    </GoogleOAuthProvider>
  );
};

export default App;