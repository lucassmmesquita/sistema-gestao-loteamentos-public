import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import BoletoForm from '../../components/boletos/BoletoForm';
import BoletosEmLote from '../../components/boletos/BoletosEmLote';

const EmitirBoletos = () => {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  
  // Verifica se há contrato na query string
  const queryParams = new URLSearchParams(location.search);
  const contratoId = queryParams.get('contratoId');
  
  // Manipulador para mudança de tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Emitir Boletos
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
    </Container>
  );
};

export default EmitirBoletos;