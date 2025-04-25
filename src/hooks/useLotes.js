// src/hooks/useLotes.js

import { useContext } from 'react';
import { LoteContext } from '../contexts/LoteContext';

const useLotes = () => {
  const context = useContext(LoteContext);
  
  if (!context) {
    throw new Error('useLotes deve ser usado dentro de um LoteProvider');
  }
  
  return context;
};

export default useLotes;