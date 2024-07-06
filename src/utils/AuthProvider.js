import React, { useContext, useState, useEffect, createContext } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérifier la présence du token au démarrage de l'application
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        setUser({ token }); // Simuler l'utilisateur connecté avec le token
      }
    };

    checkToken();
  }, []);

  const login = async (token) => {
    // Stocker le token dans SecureStore lors de la connexion
    await SecureStore.setItemAsync("userToken", token);
    setUser(token);
  };

  const logout = async () => {
    // Supprimer le token de SecureStore lors de la déconnexion
    await SecureStore.deleteItemAsync("userToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
