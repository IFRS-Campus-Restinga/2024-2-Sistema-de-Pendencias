import { createContext, useEffect, useState } from "react";
import { UsuarioService } from "../services/usuarioService";

export const UserContext = createContext(null);

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
    obterSessao();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
