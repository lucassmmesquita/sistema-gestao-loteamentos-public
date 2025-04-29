// src/hooks/useContratos.js (modificado)

import { useContext } from 'react';
import { ContratoContext } from '../contexts/ContratoContext';

// Hook personalizado para acessar o ContratoContext
const useContratos = () => {
  const context = useContext(ContratoContext);
  
  if (!context) {
    throw new Error('useContratos deve ser usado dentro de um ContratoProvider');
  }
  
  // Fornecer valores padrão para evitar erros de undefined
  const safeContext = {
    ...context,
    contratos: context.contratos || [],
    lotes: [], // Valor padrão seguro para lotes
    clientes: [], // Valor padrão seguro para clientes
    currentContrato: context.currentContrato || null,
    loading: context.loading || false,
    error: context.error || null,
    contratosFiltrados: context.contratosFiltrados || []
  };
  
  return safeContext;
};

export default useContratos;