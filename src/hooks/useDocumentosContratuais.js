// src/hooks/useDocumentosContratuais.js
import { useContext } from 'react';
import { DocumentosContratuaisContext } from '../contexts/DocumentosContratuaisContext';

// Hook personalizado para acessar o DocumentosContratuaisContext
const useDocumentosContratuais = () => {
  const context = useContext(DocumentosContratuaisContext);
  
  if (!context) {
    throw new Error('useDocumentosContratuais deve ser usado dentro de um DocumentosContratuaisProvider');
  }
  
  return context;
};

export default useDocumentosContratuais;