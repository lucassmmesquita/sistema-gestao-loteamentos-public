import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Box, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import BoletoForm from '../../components/boletos/BoletoForm';
import BoletosEmLote from '../../components/boletos/BoletosEmLote';

const EmitirBoletos = () => {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Verifica se há contrato na query string
  const queryParams = new URLSearchParams(location.search);
  const contratoId = queryParams.get('contratoId');
  
  // Manipulador para mudança de tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <Box>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          fontSize: { xs: '1.75rem', md: '2.125rem' },
          mb: 3
        }}
      >
        Emissão de Boletos
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Boleto Individual" />
          <Tab label="Boletos em Lote" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && (
        <BoletoForm contratoInicial={contratoId} />
      )}
      
      {tabValue === 1 && (
        <BoletosEmLote />
      )}
    </Box>
  );
};

export default EmitirBoletos;