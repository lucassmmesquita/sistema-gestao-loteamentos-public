// src/hooks/useAuth.js

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook personalizado para acessar o AuthContext
 * @returns {Object} Contexto de autenticação
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

export default useAuth;