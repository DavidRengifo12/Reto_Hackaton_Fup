import React, { useState, createContext, useEffect, useContext } from "react";
import supabase from "../Supabase";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  logout: async () => {},
});

export const Authprovider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadPerfilUsuario = async (authUser) => {
    if (!authUser) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    const { data: perfil } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (perfil) {
      perfil.email = authUser.email;
      setUser(perfil);
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        loadPerfilUsuario(data.user);
      }
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (__event, session) => {
        if (session?.user) {
          loadPerfilUsuario(session.user);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []); 

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout }}>
      {loading ? <div>Cargando ...</div> : children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
