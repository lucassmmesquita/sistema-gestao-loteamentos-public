// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Verificar se há token salvo
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Validar o token com o backend
          const userData = await authService.validateToken(token);
          setUser(userData);
          setIsAuthenticated(true);
          // Configurar o token para as requisições
          authService.setAuthToken(token);
        }
      } catch (err) {
        console.error('Erro ao validar token:', err);
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    if (!user || !user.permissions || !permissions.length) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    // Funções específicas para verificação de perfil
    isPerfil: (perfil) => user?.perfil === perfil,
    isLoteadora: () => user?.perfil === 'loteadora',
    isVendedor: () => user?.perfil === 'vendedor',
    isDonoTerreno: () => user?.perfil === 'dono_terreno'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};