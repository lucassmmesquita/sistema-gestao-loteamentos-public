import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';

import { InadimplenciaProvider } from '../../contexts/InadimplenciaContext';
import AcoesCobranca from '../../components/inadimplencia/AcoesCobranca';

/**
 * Página de detalhes do cliente inadimplente
 * @returns {JSX.Element} - Componente renderizado
 */
const DetalheClienteInadimplente = () => {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Redirecionar para a página de inadimplência se não houver clienteId
  useEffect(() => {
    if (!clienteId) {
      navigate('/inadimplencia');
    }
  }, [clienteId, navigate]);
  
  if (!clienteId) {
    return null;
  }
  
  return (
    <InadimplenciaProvider>
      {/* Componente de ações de cobrança */}
      <AcoesCobranca />
    </InadimplenciaProvider>
  );
};

export default DetalheClienteInadimplente;