// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  
  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      if (token) {
        try {
          const userData = await authService.validateToken(token);
          setUser(userData);
          localStorage.setItem('auth_token', token);
        } catch (err) {
          console.error('Erro ao validar token:', err);
          setUser(null);
          setToken(null);
          localStorage.removeItem('auth_token');
          setError('Sessão expirada. Por favor, faça login novamente.');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [token]);
  
  // Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.login(email, password);
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
      
      return data;
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Logout
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  }, []);
  
  // Verificar se o usuário tem permissão específica
  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);
  
  // Verificar se o usuário tem uma das permissões
  const hasAnyPermission = useCallback((permissions = []) => {
    if (!user || !user.permissions) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  }, [user]);
  
  // Verificar se o usuário tem todas as permissões
  const hasAllPermissions = useCallback((permissions = []) => {
    if (!user || !user.permissions) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  }, [user]);
  
  // Registrar novo usuário (para administradores)
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      return await authService.register(userData);
    } catch (err) {
      console.error('Erro ao registrar usuário:', err);
      setError(err.message || 'Erro ao registrar usuário.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Atualizar usuário
  const updateUser = useCallback(async (userId, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await authService.updateUser(userId, userData);
      
      // Se o usuário atualizado for o usuário atual, atualiza o estado
      if (user && user.id === updatedUser.id) {
        setUser(updatedUser);
      }
      
      return updatedUser;
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      setError(err.message || 'Erro ao atualizar usuário.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Recuperar senha
  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      return await authService.forgotPassword(email);
    } catch (err) {
      console.error('Erro ao solicitar recuperação de senha:', err);
      setError(err.message || 'Erro ao solicitar recuperação de senha.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Resetar senha
  const resetPassword = useCallback(async (token, password) => {
    setLoading(true);
    setError(null);
    
    try {
      return await authService.resetPassword(token, password);
    } catch (err) {
      console.error('Erro ao resetar senha:', err);
      setError(err.message || 'Erro ao resetar senha.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const value = {
    user,
    loading,
    error,
    token,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateUser,
    forgotPassword,
    resetPassword,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};