// src/hooks/useBoletos.js

import { useContext } from 'react';
import { BoletoContext } from '../contexts/BoletoContext';

/**
 * Hook personalizado para acessar o BoletoContext
 * @returns {Object} Contexto de boletos
 */
const useBoletos = () => {
  const context = useContext(BoletoContext);
  
  if (!context) {
    throw new Error('useBoletos deve ser usado dentro de um BoletoProvider');
  }
  
  return context;
};

export default useBoletos;