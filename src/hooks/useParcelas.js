// src/hooks/useParcelas.js

import { useContext } from 'react';
import { ParcelaContext } from '../contexts/ParcelaContext';

/**
 * Hook personalizado para acessar o ParcelaContext
 * @returns {Object} Contexto de parcelas
 */
const useParcelas = () => {
  const context = useContext(ParcelaContext);
  
  if (!context) {
    throw new Error('useParcelas deve ser usado dentro de um ParcelaProvider');
  }
  
  return context;
};

export default useParcelas;