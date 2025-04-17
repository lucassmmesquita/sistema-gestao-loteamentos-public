// src/hooks/useClientes.js

import { useContext } from 'react';
import { ClienteContext } from '../contexts/ClienteContext';

const useClientes = () => {
  const context = useContext(ClienteContext);
  
  if (!context) {
    throw new Error('useClientes deve ser usado dentro de um ClienteProvider');
  }
  
  return context;
};

export default useClientes;