import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = authService.getUser();
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Login
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(username, password);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = err.message || "Erro ao fazer login";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Registro
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(userData);
      // Não define usuário nem navega - redirecionamento é feito na página
      return response;
    } catch (err) {
      const errorMessage = err.message || "Erro ao registrar";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Atualizar usuário
  const updateUser = async (userId, userData) => {
    try {
      setError(null);
      setLoading(true);
      const updatedUser = await authService.updateUser(userId, userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMessage = err.message || "Erro ao atualizar usuário";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Recarregar perfil do usuário
  const refreshProfile = async () => {
    try {
      setError(null);
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      return profile;
    } catch (err) {
      console.error("Erro ao recarregar perfil:", err);
      throw err;
    }
  };

  // Deletar usuário
  const deleteUser = async (userId) => {
    try {
      setError(null);
      setLoading(true);
      await authService.deleteUser(userId);
      setUser(null);
      return true;
    } catch (err) {
      const errorMessage = err.message || "Erro ao deletar conta";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    refreshProfile,
    deleteUser,
    isAuthenticated: !!user,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
