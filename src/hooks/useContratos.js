import { useContext } from 'react';
import { ContratoContext } from '../contexts/ContratoContext';

// Hook personalizado para acessar o ContratoContext
const useContratos = () => {
  const context = useContext(ContratoContext);
  
  if (!context) {
    throw new Error('useContratos deve ser usado dentro de um ContratoProvider');
  }
  
  return context;
};

export default useContratos;