import { createContext, useEffect, useState } from "react";
import { UsuarioService } from "../services/usuarioService";

export const UserContext = createContext(null);

const ROTAS_AUTH = ['/session/token/', '/session/auth/'];

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const obterSessao = async () => {
      try {
        const res = await UsuarioService.obterSessao();

        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false)
      }
    };

  useEffect(() => {
    const isRotaAuth = ROTAS_AUTH.some(r => window.location.pathname.startsWith(r));
    if (isRotaAuth) {
      setLoading(false);
      return;
    }
    obterSessao();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
